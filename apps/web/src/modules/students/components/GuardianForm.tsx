import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/components/ui/input';
import { createAndLinkGuardianSchema, type GuardianFormValues } from '../schemas';

interface GuardianFormProps {
  onSubmit: (data: GuardianFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function GuardianForm({ onSubmit }: GuardianFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardianFormValues>({
    resolver: zodResolver(createAndLinkGuardianSchema) as any,
    defaultValues: {
      link: {
        relationship_type: 'Father',
        is_primary_contact: false,
      }
    }
  });

  return (
    <form id="guardian-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Guardian Information</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <Input
            label="Name"
            {...register('guardian.name')}
            error={errors.guardian?.name?.message}
          />
          <Input
            label="Phone"
            {...register('guardian.phone')}
            error={errors.guardian?.phone?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('guardian.email')}
            error={errors.guardian?.email?.message}
          />
          <Input
            label="Address"
            {...register('guardian.address')}
            error={errors.guardian?.address?.message}
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-4">Relationship</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...register('link.relationship_type')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
              <option value="Sibling">Sibling</option>
            </select>
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('link.is_primary_contact')} />
              <span>Primary Contact</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
