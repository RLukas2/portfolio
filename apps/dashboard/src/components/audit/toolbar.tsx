import { Button } from '@xbrk/ui/button';
import { Input } from '@xbrk/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@xbrk/ui/select';
import { DownloadIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AuditToolbarProps {
  actionTypes: string[];
  filters: {
    resource?: string;
    action?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  };
  onExport: () => void;
  onFiltersChange: (filters: AuditToolbarProps['filters']) => void;
  resourceTypes: string[];
}

export function AuditToolbar({ resourceTypes, actionTypes, filters, onFiltersChange, onExport }: AuditToolbarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search ?? '');

  // Debounce search with proper cleanup
  useEffect(() => {
    if (localSearch === (filters.search ?? '')) {
      return; // Skip if search hasn't changed
    }

    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: localSearch || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, filters, onFiltersChange]);

  const hasActiveFilters = filters.resource || filters.action || filters.search || filters.startDate || filters.endDate;

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            className="h-9 w-[250px]"
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search actions, resources, or IDs..."
            value={localSearch}
          />

          <Select
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                resource: value === 'all' ? undefined : value,
              })
            }
            value={filters.resource ?? 'all'}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {resourceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                action: value === 'all' ? undefined : value,
              })
            }
            value={filters.action ?? 'all'}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="h-9 w-[150px]"
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
            placeholder="Start date"
            type="date"
            value={filters.startDate ?? ''}
          />

          <Input
            className="h-9 w-[150px]"
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                endDate: e.target.value || undefined,
              })
            }
            placeholder="End date"
            type="date"
            value={filters.endDate ?? ''}
          />

          {hasActiveFilters && (
            <Button className="h-9 px-2" onClick={clearFilters} variant="ghost">
              Clear
              <XIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <Button onClick={onExport} size="sm" variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
