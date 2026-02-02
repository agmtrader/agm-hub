import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountriesFormField from '@/components/misc/CountriesFormField';
import { Input } from '@/components/ui/input';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { regulatory_codes, affiliation_relationships } from '@/lib/entities/application';

interface RegulatoryInfoStepProps {
  form: UseFormReturn<Application>;
}

const RegulatoryInfoStep = ({ form }: RegulatoryInfoStepProps) => {
  
  const { t } = useTranslationProvider();
  const accountType = form.watch('customer.type');
  const regulatoryOptions = regulatory_codes(t);

  // Determine the correct basePath depending on account type
  const basePath = React.useMemo(() => {
    switch (accountType) {
      case 'JOINT':
        return 'customer.jointHolders.regulatoryInformation';
      case 'ORG':
        return 'customer.organization.regulatoryInformation';
      default:
        return 'customer.accountHolder.regulatoryInformation';
    }
  }, [accountType]);

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.regulatory.regulatory_information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {regulatoryOptions.map((opt, index) => {
          const statusPath = `${basePath}.0.regulatoryDetails.${index}.status` as const;
          const detailsPath = `${basePath}.0.regulatoryDetails.${index}.details` as const;
          const codePath = `${basePath}.0.regulatoryDetails.${index}.code` as const;

          // Ensure code is set once
          React.useEffect(() => {
            form.setValue(codePath as any, opt.code as any, { shouldValidate: false, shouldDirty: false });
          }, [codePath, opt.code, form]);

          const isYes = !!form.watch(statusPath as any);

          return (
            <div key={opt.code} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">{opt.label}</p>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={statusPath as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Select
                            onValueChange={(val) => {
                              const next = val === 'true';
                              field.onChange(next);
                              // reset details when toggling
                              form.setValue(detailsPath as any, next ? '' : '', { shouldDirty: true, shouldValidate: false });
                            }}
                            defaultValue={String(!!field.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="false">{t('apply.account.regulatory.no')}</SelectItem>
                              <SelectItem value="true">{t('apply.account.regulatory.yes')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isYes && (
                <div className="pl-1 space-y-4">
                  {opt.code === 'AFFILIATION' ? (
                    <AffiliationFields basePath={`${basePath}.0.regulatoryDetails.${index}.affiliation`} form={form} />
                  ) : (
                    <FormField
                      control={form.control}
                      name={detailsPath as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('apply.account.regulatory.company_stock_symbols')}</FormLabel>
                          <FormDescription>
                            {t('apply.account.regulatory.company_stock_symbols_description')}
                          </FormDescription>
                          <FormControl>
                            <Input
                              placeholder="e.g. AAPL, MSFT"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

/** Affiliation extra fields */
const AffiliationFields = ({ basePath, form }: { basePath: string; form: UseFormReturn<Application> }) => {
  const { t } = useTranslationProvider();
  return (
    <div className="space-y-4">
      {/* Relationship */}
      <FormField
        control={form.control}
        name={`${basePath}.affiliationRelationship` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.regulatory.affiliation_fields.relationship')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {affiliation_relationships(t).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Person Name */}
      <FormField
        control={form.control}
        name={`${basePath}.personName` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.regulatory.affiliation_fields.affiliated_person_name')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Company */}
      <FormField
        control={form.control}
        name={`${basePath}.company` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.regulatory.affiliation_fields.company')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Compliance officer phone */}
      <FormField
        control={form.control}
        name={`${basePath}.companyPhone` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.regulatory.affiliation_fields.compliance_officer_phone')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Compliance officer email */}
      <FormField
        control={form.control}
        name={`${basePath}.companyEmailAddress` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.regulatory.affiliation_fields.compliance_officer_email')}</FormLabel>
            <FormControl>
              <Input placeholder="" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CountriesFormField form={form} element={{ name: `${basePath}.country`, title: t('apply.account.account_holder_info.country') }} />
        <FormField
          control={form.control}
          name={`${basePath}.state` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.regulatory.affiliation_fields.state_province')}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.city` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.regulatory.affiliation_fields.city')}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.postalCode` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.regulatory.affiliation_fields.postal_code')}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RegulatoryInfoStep;
