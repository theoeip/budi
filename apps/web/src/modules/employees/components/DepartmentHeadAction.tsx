import { useSetDepartmentHead } from '../repositories/useEmployeeDepartmentRepository';

interface DepartmentHeadActionProps {
  employeeId: string;
  departmentId: string;
}

export function DepartmentHeadAction({ employeeId, departmentId }: DepartmentHeadActionProps) {
  const setHead = useSetDepartmentHead();

  const handleSetHead = () => {
    if (confirm('Are you sure you want to make this employee the Head of Department? This will replace the current head if one exists.')) {
      setHead.mutate({ id: employeeId, departmentId });
    }
  };

  return (
    <button
      onClick={handleSetHead}
      disabled={setHead.isPending}
      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium disabled:opacity-50"
    >
      Make Head
    </button>
  );
}
