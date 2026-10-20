import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createInitiative, updateInitiative } from '@/store/slices/initiativesSlice';
import type { Initiative, InitiativeFormData, InitiativeStatus, InitiativePriority } from '@/types';
import { Modal, Button, Input, Field } from '@/components/ui';
import { inputClass } from '@/components/ui/Input';

interface InitiativeModalProps {
  open: boolean;
  onClose: () => void;
  initiative: Initiative | null;
}

const statusOptions: InitiativeStatus[] = [
  'Not Started',
  'In Progress',
  'At Risk',
  'Completed',
  'On Hold',
];

const priorityOptions: InitiativePriority[] = ['Low', 'Medium', 'High', 'Critical'];

const categoryOptions = ['Product', 'Engineering', 'Marketing', 'Operations', 'Sales', 'HR', 'Finance'];

export default function InitiativeModal({ open, onClose, initiative }: InitiativeModalProps) {
  const dispatch = useAppDispatch();
  const isEditing = !!initiative;

  const [formData, setFormData] = useState<InitiativeFormData>({
    title: '',
    description: '',
    owner: '',
    status: 'Not Started',
    priority: 'Medium',
    deadline: '',
    category: '',
    tags: [],
    progress: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (initiative) {
      setFormData({
        title: initiative.title,
        description: initiative.description || '',
        owner: initiative.owner,
        status: initiative.status,
        priority: initiative.priority,
        deadline: initiative.deadline.split('T')[0],
        category: initiative.category || '',
        tags: initiative.tags || [],
        progress: initiative.progress,
      });
      setTagsInput((initiative.tags || []).join(', '));
    } else {
      setFormData({
        title: '',
        description: '',
        owner: '',
        status: 'Not Started',
        priority: 'Medium',
        deadline: '',
        category: '',
        tags: [],
        progress: 0,
      });
      setTagsInput('');
    }
    setErrors({});
  }, [initiative, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Parse tags from comma-separated input
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const dataToSubmit: InitiativeFormData = {
        ...formData,
        tags,
      };

      if (isEditing && initiative) {
        await dispatch(updateInitiative({ id: initiative._id, data: dataToSubmit })).unwrap();
      } else {
        await dispatch(createInitiative(dataToSubmit)).unwrap();
      }

      onClose();
    } catch (err) {
      console.error('Failed to save initiative:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof InitiativeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Initiative' : 'New Initiative'}
      className="max-w-2xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            data-icod-id="src_components_initiativemodal_tsx_05d4">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={submitting}
            data-icod-id="src_components_initiativemodal_tsx_836c">
            {isEditing ? 'Save Changes' : 'Create Initiative'}
          </Button>
        </>
      }
      data-icod-id="src_components_initiativemodal_tsx_683d">
      <div
        className="grid gap-4 sm:grid-cols-2"
        data-icod-id="src_components_initiativemodal_tsx_b22c">
        {/* Title - full width */}
        <Field
          label="Title"
          htmlFor="title"
          required
          error={errors.title}
          className="sm:col-span-2"
          data-icod-id="src_components_initiativemodal_tsx_8d03">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter initiative title"
            data-icod-id="src_components_initiativemodal_tsx_5034" />
        </Field>

        {/* Description - full width */}
        <Field
          label="Description"
          htmlFor="description"
          className="sm:col-span-2"
          data-icod-id="src_components_initiativemodal_tsx_334a">
          <textarea
            id="description"
            className={inputClass('min-h-20 resize-none')}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe this initiative..."
            data-icod-id="src_components_initiativemodal_tsx_83fd" />
        </Field>

        {/* Owner */}
        <Field
          label="Owner"
          htmlFor="owner"
          required
          error={errors.owner}
          data-icod-id="src_components_initiativemodal_tsx_5f3a">
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => handleChange('owner', e.target.value)}
            placeholder="Name or email"
            data-icod-id="src_components_initiativemodal_tsx_e26a" />
        </Field>

        {/* Category */}
        <Field
          label="Category"
          htmlFor="category"
          data-icod-id="src_components_initiativemodal_tsx_1544">
          <select
            id="category"
            className={inputClass()}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            data-icod-id="src_components_initiativemodal_tsx_dd6c">
            <option value="" data-icod-id="src_components_initiativemodal_tsx_c9a2">Select category</option>
            {categoryOptions.map((cat) => (
              <option
                key={cat}
                value={cat}
                data-icod-id={`src_components_initiativemodal_tsx_5546_${cat}`}>
                {cat}
              </option>
            ))}
          </select>
        </Field>

        {/* Status */}
        <Field
          label="Status"
          htmlFor="status"
          data-icod-id="src_components_initiativemodal_tsx_7a66">
          <select
            id="status"
            className={inputClass()}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            data-icod-id="src_components_initiativemodal_tsx_c84f">
            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
                data-icod-id={`src_components_initiativemodal_tsx_a668_${status}`}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        {/* Priority */}
        <Field
          label="Priority"
          htmlFor="priority"
          data-icod-id="src_components_initiativemodal_tsx_367b">
          <select
            id="priority"
            className={inputClass()}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            data-icod-id="src_components_initiativemodal_tsx_7347">
            {priorityOptions.map((priority) => (
              <option
                key={priority}
                value={priority}
                data-icod-id={`src_components_initiativemodal_tsx_699c_${priority}`}>
                {priority}
              </option>
            ))}
          </select>
        </Field>

        {/* Deadline */}
        <Field
          label="Deadline"
          htmlFor="deadline"
          required
          error={errors.deadline}
          data-icod-id="src_components_initiativemodal_tsx_9fe1">
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            data-icod-id="src_components_initiativemodal_tsx_38ab" />
        </Field>

        {/* Progress */}
        <Field
          label="Progress"
          htmlFor="progress"
          hint={`${formData.progress}%`}
          data-icod-id="src_components_initiativemodal_tsx_e52d">
          <div
            className="flex items-center gap-3"
            data-icod-id="src_components_initiativemodal_tsx_9685">
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => handleChange('progress', parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              data-icod-id="src_components_initiativemodal_tsx_e162" />
            <span
              className="w-12 text-right text-sm font-medium text-foreground"
              data-icod-id="src_components_initiativemodal_tsx_6cac">
              {formData.progress}%
            </span>
          </div>
        </Field>

        {/* Tags - full width */}
        <Field
          label="Tags"
          htmlFor="tags"
          hint="Separate multiple tags with commas"
          className="sm:col-span-2"
          data-icod-id="src_components_initiativemodal_tsx_2e07">
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="product, q4, roadmap"
            data-icod-id="src_components_initiativemodal_tsx_fac6" />
        </Field>
      </div>
    </Modal>
  );
}
