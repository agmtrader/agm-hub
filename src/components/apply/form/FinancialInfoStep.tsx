import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { investment_objectives as getInvestmentObjectives, source_of_wealth as getSourceOfWealth, asset_classes, knowledge_levels } from '@/lib/public/form';

interface FinancialInfoStepProps {
  form: UseFormReturn<Application>;
}

const FinancialInfoStep = ({ form }: FinancialInfoStepProps) => {
  const { t } = useTranslationProvider();
  const accountType = form.watch('customer.type');

  const investmentObjectivesOptions = getInvestmentObjectives(t);
  const sourceOfWealthOptions = getSourceOfWealth(t);

  // Determine the correct basePath depending on account type
  const basePath = React.useMemo(() => {
    switch (accountType) {
      case 'JOINT':
        return 'customer.jointHolders.financialInformation';
      case 'ORG':
        return 'customer.organization.financialInformation';
      default:
        return 'customer.accountHolder.financialInformation';
    }
  }, [accountType]);

  /** Sub-component: dynamic Sources of Wealth list */
  const SourcesOfWealthFields = ({ basePath }: { basePath: string }) => {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: `${basePath}.0.sourcesOfWealth` as any,
    });

    return (
      <div className="space-y-4">
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            {/* Source Type */}
            <FormField
              control={form.control}
              name={`${basePath}.0.sourcesOfWealth.${index}.sourceType` as any}
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {index === 0 && (
                    <>
                      <FormLabel>{t('apply.account.account_holder_info.source_type')}</FormLabel>
                      <FormDescription>
                        {t('apply.account.account_holder_info.source_of_wealth_description')}
                      </FormDescription>
                    </>
                  )}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sourceOfWealthOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Percentage */}
            <FormField
              control={form.control}
              name={`${basePath}.0.sourcesOfWealth.${index}.percentage` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.percentage')}</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Remove button */}
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ sourceType: '', percentage: 0 })}>
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.account_holder_info.add_source')}
        </Button>
      </div>
    );
  };

  /** Sub-component: dynamic Investment Experience list */
  const InvestmentExperienceFields = ({ basePath }: { basePath: string }) => {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: `${basePath}.0.investmentExperience` as any,
    });

    return (
      <div className="space-y-4">
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            {/* Asset Class */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.assetClass` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.asset_class')}</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asset_classes.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Years Trading */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.yearsTrading` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.years_trading')}</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Trades per Year */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.tradesPerYear` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.trades_per_year')}</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Knowledge Level */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.knowledgeLevel` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.knowledge_level')}</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {knowledge_levels.map((lvl) => (
                        <SelectItem key={lvl.value} value={lvl.value}>
                          {lvl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Remove button */}
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ assetClass: '', yearsTrading: 0, tradesPerYear: 0, knowledgeLevel: '' })}>
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.account_holder_info.add_experience')}
        </Button>
      </div>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_holder_info.financial_information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Net Worth */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.0.netWorth` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.net_worth')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <p className="text-xs text-subtitle">{t('apply.account.account_holder_info.net_worth_help')}</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.0.liquidNetWorth` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.liquid_net_worth')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <p className="text-xs text-subtitle">{t('apply.account.account_holder_info.liquid_net_worth_help')}</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.0.annualNetIncome` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.annual_net_income')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <p className="text-xs text-subtitle">{t('apply.account.account_holder_info.annual_net_income_help')}</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Investment Objectives – synced from Account step; read-only display */}
        <FormField
          control={form.control}
          name={`${basePath}.0.investmentObjectives` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.investment_objectives')}</FormLabel>
              <div className="flex flex-wrap gap-2">
                {((field.value as string[]) || []).map((obj) => {
                  const label = investmentObjectivesOptions.find((o) => o.id === obj)?.label || obj;
                  return (
                    <span key={obj} className="px-2 py-1 rounded bg-muted text-sm">
                      {label}
                    </span>
                  );
                })}
                {!(field.value && field.value.length) && (
                  <span className="text-subtitle text-sm">
                    {t('apply.account.account_holder_info.investment_objectives_description')}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Investment Experience */}
        <h4 className="text-lg font-semibold">
          {t('apply.account.account_holder_info.investment_experience')}
        </h4>
        <InvestmentExperienceFields basePath={basePath} />

        {/* Source of Wealth */}
        <h4 className="text-lg font-semibold">
          {t('apply.account.account_holder_info.source_of_wealth')}
        </h4>
        <SourcesOfWealthFields basePath={basePath} />
      </CardContent>
    </Card>
  );
};

export default FinancialInfoStep;
