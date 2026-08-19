'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultValues, FieldValues, FormProvider, Path, useForm } from "react-hook-form";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomFormField } from "./custom-form-field";
import { CustomFormSelect } from "./custom-form-select";

type SelectValue = string | number | boolean;
type CustomFieldType = "text" | "date";

type SelectField<TForm extends FieldValues> = {
  type: "select";
  name: Path<TForm>;
  label: string;
  placeholder: string;
  allValue: SelectValue;
  items: Array<{ value: SelectValue; name: string }>;
};

type FormField<TForm extends FieldValues> = {
  type: "field";
  name: Path<TForm>;
  label: string;
  placeholder?: string;
  fieldType?: CustomFieldType;
  disabled?: boolean;
};

type DrawerField<TForm extends FieldValues> = SelectField<TForm> | FormField<TForm>;

type SearchField<TForm extends FieldValues> = {
  name: Path<TForm>;
  label: string;
  placeholder: string;
  fieldType?: CustomFieldType;
  debounceMs?: number;
};

type TableFiltersProps<TForm extends FieldValues, TParams> = {
  defaultValues: TForm;
  onFiltersChange: (filters: TParams) => void;
  toQueryParams: (values: TForm, debouncedSearch?: string) => TParams;
  searchField?: SearchField<TForm>;
  drawerFields: DrawerField<TForm>[];
  drawerTitle?: string;
  drawerDescription?: string;
  resetButtonLabel?: string;
};

export const TableFilters = <TForm extends FieldValues, TParams>({
  defaultValues,
  onFiltersChange,
  toQueryParams,
  searchField,
  drawerFields,
  drawerTitle = "Filtros",
  drawerDescription = "Ajusta los filtros para refinar la tabla.",
  resetButtonLabel = "Reiniciar filtros",
}: TableFiltersProps<TForm, TParams>) => {
  const [open, setOpen] = useState(false);
  const form = useForm<TForm>({ defaultValues: defaultValues as DefaultValues<TForm> });
  const values = form.watch();
  const onFiltersChangeRef = useRef(onFiltersChange);
  const toQueryParamsRef = useRef(toQueryParams);

  onFiltersChangeRef.current = onFiltersChange;
  toQueryParamsRef.current = toQueryParams;

  const [debouncedSearch, setDebouncedSearch] = useState(() => {
    if (!searchField) return "";
    const current = values[searchField.name];
    return typeof current === "string" ? current : "";
  });

  const activeCount = useMemo(() => {
    return drawerFields.reduce((count, field) => {
      const value = values[field.name];
      if (field.type === "select") {
        return value !== field.allValue ? count + 1 : count;
      }
      if (typeof value === "string") {
        return value.trim() ? count + 1 : count;
      }
      return value ? count + 1 : count;
    }, 0);
  }, [drawerFields, values]);

  const searchFieldName = searchField?.name;
  const searchDebounceMs = searchField?.debounceMs ?? 300;

  const searchValue = searchFieldName
    ? values[searchFieldName]
    : undefined;

  useEffect(() => {
    if (!searchFieldName) return;
    const nextSearch = typeof searchValue === "string" ? searchValue : "";
    const timer = setTimeout(() => {
      setDebouncedSearch(nextSearch);
    }, searchDebounceMs);
    return () => clearTimeout(timer);
  }, [searchFieldName, searchDebounceMs, searchValue]);

  const drawerFieldValues = drawerFields.map((field) => values[field.name]);
  const drawerValuesKey = JSON.stringify(drawerFieldValues);

  useEffect(() => {
    onFiltersChangeRef.current(
      toQueryParamsRef.current(
        form.getValues(),
        searchField ? debouncedSearch : undefined,
      ),
    );
  }, [debouncedSearch, drawerValuesKey, form]);

  const handleReset = () => form.reset(defaultValues);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <FormProvider {...form}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-800 px-4 py-3">
          {searchField && (
            <div className="w-full max-w-75">
              <CustomFormField
                name={searchField.name}
                label={searchField.label}
                type={searchField.fieldType ?? "text"}
                placeholder={searchField.placeholder}
              />
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="relative gap-2"
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </div>

        <SheetContent>
          <form className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle>{drawerTitle}</SheetTitle>
              <SheetDescription>{drawerDescription}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
              {drawerFields.map((field) => (
                field.type === "select" ? (
                  <CustomFormSelect
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    items={field.items}
                  />
                ) : (
                  <CustomFormField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.fieldType ?? "text"}
                    placeholder={field.placeholder ?? ""}
                    disabled={field.disabled}
                  />
                )
              ))}
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReset}
                className="w-full gap-2"
              >
                <RotateCcw className="size-4" />
                {resetButtonLabel}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </FormProvider>
    </Sheet>
  );
};
