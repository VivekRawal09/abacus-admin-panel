import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getCrudConfig,
  populateFieldOptions,
  transformFormData,
} from "../utils/crudFieldConfigs";
import { useSoftDeleteWithUndo } from "../components/common/SoftDeleteWithUndo";

/**
 * Reusable CRUD Hook
 *
 * @param {string} entityType - Type of entity (user, video, institute, zone)
 * @param {Object} service - Service object with CRUD methods
 * @param {function} refetchData - Function to refresh the main data list
 */
export const useCrud = (entityType, service, refetchData) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsData, setOptionsData] = useState({});
  const [showEnhancedDelete, setShowEnhancedDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cascadingEffects, setCascadingEffects] = useState([]);

  const config = getCrudConfig(entityType);

  // ADD the soft delete hook
  const { performSoftDelete } = useSoftDeleteWithUndo(
    entityType, 
    (itemId, reason) => {
      switch (entityType) {
        case 'user':
          return service.deleteUserEnhanced ? service.deleteUserEnhanced(itemId, reason) : service.deleteUser(itemId);
        case 'video':
          return service.deleteVideoEnhanced ? service.deleteVideoEnhanced(itemId, reason) : service.deleteVideo(itemId);
        case 'institute':
          return service.deleteInstituteEnhanced ? service.deleteInstituteEnhanced(itemId, reason) : service.deleteInstitute(itemId);
        default:
          return service[`delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`](itemId);
      }
    }
  );

  // Load options for select fields (institutes, zones, users, etc.)
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const options = {};

      // Load institutes if needed
      if (needsInstitutes()) {
        try {
          const institutesResponse = await service.getInstitutes?.();
          options.institutes = institutesResponse?.data || [];
          console.log(
            "✅ Institutes loaded for options:",
            options.institutes.length
          );
        } catch (error) {
          console.warn("⚠️ Institutes API not available for options");
          options.institutes = [];
        }
      }

      if (needsZones()) {
        try {
          const zonesResponse = await service.getZones?.();
          options.zones = zonesResponse?.data || [];
          console.log("✅ Zones loaded for options:", options.zones.length);
        } catch (error) {
          console.warn(
            "⚠️ Zones API not available for options (expected if not implemented)"
          );
          // Provide default zones since API doesn't exist yet
          options.zones = [
            { id: "1", name: "Northern Zone" },
            { id: "2", name: "Southern Zone" },
            { id: "3", name: "Eastern Zone" },
            { id: "4", name: "Western Zone" },
          ];
        }
      }

      // Load users for admin/manager selection
      if (needsUsers()) {
        const usersResponse = await service.getUsers?.();
        options.admins =
          usersResponse?.data?.filter((user) =>
            ["institute_admin", "super_admin"].includes(user.role)
          ) || [];
        options.managers =
          usersResponse?.data?.filter((user) =>
            ["zone_manager", "super_admin"].includes(user.role)
          ) || [];
      }

      setOptionsData(options);
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  };

  const needsInstitutes = () => {
    return config.fields.some((field) => field.name === "institute_id");
  };

  const needsZones = () => {
    return config.fields.some((field) => field.name === "zone_id");
  };

  const needsUsers = () => {
    return config.fields.some((field) =>
      ["admin_id", "manager_id"].includes(field.name)
    );
  };

  // Get populated field configuration
  const getFieldConfig = () => {
    return populateFieldOptions(config.fields, optionsData);
  };

  // Handle create
  const handleCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle view
  const handleView = (item) => {
    setModalMode("view");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalMode("create");
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const transformedData = transformFormData(formData, entityType);

      if (modalMode === "create") {
        await handleCreateSubmit(transformedData);
      } else if (modalMode === "edit") {
        await handleEditSubmit(transformedData);
      }

      handleCloseModal();
      refetchData();
    } catch (error) {
      console.error(`Failed to ${modalMode} ${entityType}:`, error);
      throw error; // Let the modal handle the error display
    } finally {
      setLoading(false);
    }
  };

  // Handle create submission - UPDATED VERSION
  const handleCreateSubmit = async (data) => {
    let response;

    switch (entityType) {
      case "user":
        response = await service.createUser(data);
        break;
      case "video":
        // UPDATED: Use your exact backend field names
        if (
          service.addVideoFromYouTube &&
          (data.youtubeVideoId || data.youtube_video_id)
        ) {
          const videoId = data.youtubeVideoId || data.youtube_video_id;
          response = await service.addVideoFromYouTube(videoId, {
            category: data.category,
            difficulty: data.difficulty || data.difficulty_level,
            courseOrder: data.courseOrder || data.course_order,
            tags: data.tags,
          });
        } else {
          response = await service.createVideo(data);
        }
        break;
      case "institute":
        response = await service.createInstitute(data);
        break;
      case "zone":
        response = await service.createZone(data);
        break;
      default:
        throw new Error(`Create method not implemented for ${entityType}`);
    }

    toast.success(`${config.itemName.slice(0, -1)} created successfully!`);
    return response;
  };

  // Handle edit submission
  const handleEditSubmit = async (data) => {
    if (!selectedItem?.id) {
      throw new Error("No item selected for editing");
    }

    let response;

    switch (entityType) {
      case "user":
        response = await service.updateUser(selectedItem.id, data);
        break;
      case "video":
        response = await service.updateVideo(selectedItem.id, data);
        break;
      case "institute":
        response = await service.updateInstitute(selectedItem.id, data);
        break;
      case "zone":
        response = await service.updateZone(selectedItem.id, data);
        break;
      default:
        throw new Error(`Update method not implemented for ${entityType}`);
    }

    toast.success(`${config.itemName.slice(0, -1)} updated successfully!`);
    return response;
  };

  // ENHANCED: Handle single delete with cascading effects preview
  const handleDeleteEnhanced = async (item) => {
    try {
      // Get cascading effects preview
      if (service.getUserDeletionPreview && entityType === 'user') {
        const preview = await service.getUserDeletionPreview(item.id);
        setCascadingEffects(preview.cascadingEffects || []);
      } else if (service.getVideoDeletionPreview && entityType === 'video') {
        const preview = await service.getVideoDeletionPreview(item.id);
        setCascadingEffects(preview.cascadingEffects || []);
      } else {
        setCascadingEffects([]);
      }

      setDeleteTarget(item);
      setShowEnhancedDelete(true);
    } catch (error) {
      console.error('Error getting deletion preview:', error);
      // Fallback to simple delete
      setDeleteTarget(item);
      setCascadingEffects([]);
      setShowEnhancedDelete(true);
    }
  };

  // ENHANCED: Confirm enhanced delete
  const handleConfirmEnhancedDelete = async ({ reason }) => {
    if (!deleteTarget) return;

    try {
      const itemName = deleteTarget.name || deleteTarget.title || deleteTarget.email || deleteTarget.first_name || `${entityType} #${deleteTarget.id}`;
      
      // Use soft delete with undo
      await performSoftDelete(deleteTarget.id, reason, itemName);
      
      setShowEnhancedDelete(false);
      setDeleteTarget(null);
      setCascadingEffects([]);
      
      // Refresh data
      refetchData();
    } catch (error) {
      console.error('Enhanced delete failed:', error);
      toast.error(`Failed to delete ${entityType}: ${error.message}`);
    }
  };

  // ENHANCED: Status change with reason tracking
  const handleStatusChangeEnhanced = async (itemId, isActive, reason) => {
    try {
      let response;
      
      switch (entityType) {
        case 'user':
          response = await service.updateUserStatusEnhanced(itemId, isActive, reason);
          break;
        case 'video':
          response = await service.updateVideoStatusEnhanced ? 
            service.updateVideoStatusEnhanced(itemId, isActive, reason) : 
            service.updateVideoStatus(itemId, isActive);
          break;
        case 'institute':
          response = await service.updateInstituteStatusEnhanced ? 
            service.updateInstituteStatusEnhanced(itemId, isActive, reason) : 
            service.updateInstituteStatus(itemId, isActive);
          break;
        default:
          response = await service.updateStatus(itemId, isActive);
      }
      
      // Refresh data
      refetchData();
      
      return response;
    } catch (error) {
      console.error('Enhanced status change failed:', error);
      throw error;
    }
  };

  // ENHANCED: Bulk operations with reason tracking
  const handleBulkActionEnhanced = async (action, itemIds, reason) => {
    if (!itemIds || itemIds.length === 0) {
      toast.error('No items selected');
      return;
    }

    setLoading(true);
    try {
      switch (action) {
        case 'delete':
          await handleBulkDeleteEnhanced(itemIds, reason);
          break;
        case 'activate':
          await handleBulkStatusUpdateEnhanced(itemIds, true, reason);
          break;
        case 'deactivate':
          await handleBulkStatusUpdateEnhanced(itemIds, false, reason);
          break;
        case 'export':
          await handleBulkExport(itemIds);
          break;
        default:
          throw new Error(`Bulk action ${action} not implemented`);
      }
      
      setSelectedItems([]);
      refetchData();
    } catch (error) {
      console.error(`Failed to ${action} ${entityType}s:`, error);
      toast.error(`Failed to ${action} ${entityType}s: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ENHANCED: Bulk delete with reason tracking
  const handleBulkDeleteEnhanced = async (itemIds, reason) => {
    switch (entityType) {
      case 'user':
        await service.bulkDeleteUsersEnhanced(itemIds, reason);
        break;
      case 'video':
        await service.bulkDeleteVideosEnhanced ? 
          service.bulkDeleteVideosEnhanced(itemIds, reason) : 
          service.bulkDeleteVideos(itemIds);
        break;
      case 'institute':
        await service.bulkDeleteInstitutesEnhanced ? 
          service.bulkDeleteInstitutesEnhanced(itemIds, reason) : 
          service.bulkDeleteInstitutes(itemIds);
        break;
      default:
        for (const id of itemIds) {
          await service[`delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`](id);
        }
    }
    
    toast.success(`${itemIds.length} ${config.itemName} deleted successfully!`);
  };

  // ENHANCED: Bulk status update with reason tracking
  const handleBulkStatusUpdateEnhanced = async (itemIds, isActive, reason) => {
    switch (entityType) {
      case 'user':
        await service.bulkUpdateUserStatusEnhanced(itemIds, isActive, reason);
        break;
      case 'video':
        await service.bulkUpdateVideoStatusEnhanced ? 
          service.bulkUpdateVideoStatusEnhanced(itemIds, isActive, reason) : 
          service.bulkUpdateVideos(itemIds, { status: isActive ? 'active' : 'inactive' });
        break;
      case 'institute':
        await service.bulkUpdateInstituteStatusEnhanced ? 
          service.bulkUpdateInstituteStatusEnhanced(itemIds, isActive, reason) : 
          service.bulkUpdateInstitutes(itemIds, { status: isActive ? 'active' : 'inactive' });
        break;
      default:
        for (const id of itemIds) {
          await service.updateStatus(id, isActive);
        }
    }
    
    const action = isActive ? 'activated' : 'deactivated';
    toast.success(`${itemIds.length} ${config.itemName} ${action} successfully!`);
  };

  // LEGACY: Keep old functions for backward compatibility
  const handleDelete = async (item) => {
    // Use enhanced version
    return handleDeleteEnhanced(item);
  };

  const handleBulkAction = async (action, itemIds) => {
    // Use enhanced version with default reason
    return handleBulkActionEnhanced(action, itemIds, `Bulk ${action} via admin panel`);
  };

  // Handle bulk export
  const handleBulkExport = async (itemIds) => {
    // Implementation depends on service capabilities
    if (service.exportUsers && entityType === "user") {
      const data = await service.exportUsers({ ids: itemIds, format: "csv" });
      downloadFile(data, `${config.itemName}.csv`);
    } else {
      toast.error("Export functionality not available for this entity");
    }
  };

  // Utility function to download file
  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Handle selection changes
  const handleSelectionChange = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Handle select all
  const handleSelectAll = (items, isSelected) => {
    if (isSelected) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  return {
    // Modal state
    isModalOpen,
    modalMode,
    selectedItem,
    loading,

    // Field configuration
    fieldConfig: getFieldConfig(),
    config,

    // Selection state
    selectedItems,

    // ENHANCED: New enhanced functions
    handleDeleteEnhanced,
    handleStatusChangeEnhanced,
    handleBulkActionEnhanced,
    handleConfirmEnhancedDelete,
    
    // Enhanced modal state
    showEnhancedDelete,
    deleteTarget,
    cascadingEffects,

    // LEGACY: Backward compatible functions (use enhanced versions)
    handleCreate,
    handleEdit,
    handleView,
    handleDelete, // Points to enhanced version
    handleCloseModal,
    handleSubmit,
    handleBulkAction, // Points to enhanced version
    handleSelectionChange,
    handleSelectAll,
    handleClearSelection,

    // Utility
    loadOptions,
  };
};