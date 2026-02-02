import React, { useEffect } from 'react';
import { UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { sources_of_wealth, asset_classes, knowledge_levels, investment_objectives, currencies, trading_products, trading_countries } from '@/lib/entities/application';
import { Checkbox } from '@/components/ui/checkbox';
import { FinancialRange } from '@/lib/entities/account';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FinancialInfoStepProps {
  form: UseFormReturn<Application>;
  setEstimatedDeposit: (value: number | null) => void;
  estimatedDeposit: number | null;
  financialRanges: FinancialRange[];
  estimatedDepositError?: string | null;
}

const FinancialInfoStep = ({
  form,
  setEstimatedDeposit,
  estimatedDeposit,
  financialRanges,
  estimatedDepositError,
}: FinancialInfoStepProps) => {

  const { t } = useTranslationProvider();
  const accountType = form.watch('customer.type');
  const tradingPermissions = useWatch({ control: form.control, name: 'accounts.0.tradingPermissions' }) || [];

  const toggleProduct = (productId: string, checked: boolean) => {
    let currentPermissions = [...(tradingPermissions || [])];
    
    // Remove existing entries for this product
    currentPermissions = currentPermissions.filter(p => p.product !== productId);

    if (checked) {
      // Add entries for all countries
      trading_countries.forEach((country: string) => {
        currentPermissions.push({
          country,
          product: productId
        });
      });
    }

    form.setValue('accounts.0.tradingPermissions', currentPermissions);
  };

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

  // Ensure financialInformation.0.investmentObjectives is initialized
  useEffect(() => {
    const objectives = (form.getValues('accounts.0.investmentObjectives') || []).filter(Boolean) as string[];
    if (objectives.length) {
      form.setValue(
        `${basePath}.0.investmentObjectives` as any,
        objectives,
        { shouldValidate: false, shouldDirty: false }
      );
    }
  }, [basePath, form]);

  // Ensure financialInformation.0.sourcesOfWealth is initialized
  useEffect(() => {
    const sourcesOfWealth = form.getValues(`${basePath}.0.sourcesOfWealth` as any);
    if (!sourcesOfWealth || sourcesOfWealth.length === 0) {
      form.setValue(
        `${basePath}.0.sourcesOfWealth` as any,
        [{ sourceType: 'SOW-IND-Income', percentage: 100 }],
        { shouldDirty: false, shouldTouch: false }
      );
    }
  }, [basePath, form]);

  // Ensure financialInformation.0.investmentExperience is initialized
  useEffect(() => {
    const investmentExperience = form.getValues(`${basePath}.0.investmentExperience` as any);
    if (!investmentExperience || investmentExperience.length === 0) {
      form.setValue(
        `${basePath}.0.investmentExperience` as any,
        [{ assetClass: 'STK', yearsTrading: 3, tradesPerYear: 25, knowledgeLevel: 'Good' }],
        { shouldDirty: false, shouldTouch: false }
      );    
    }
  }, [basePath, form]);

  const formatRangeLabel = (range: FinancialRange) => {
    const lower = Number(range.lowerBound).toLocaleString();
    const upper = range.upperBound ? Number(range.upperBound).toLocaleString() : null;
    return upper ? `${lower} - ${upper}` : `${lower}+`;
  };

  const rangeByType = React.useMemo(() => {
    return {
      netWorth: financialRanges.filter((range) => range.type === 'NET_WORTH'),
      liquidNetWorth: financialRanges.filter((range) => range.type === 'NET_WORTH_LIQUID'),
      annualNetIncome: financialRanges.filter((range) => range.type === 'ANNUAL_NET_INCOME'),
    };
  }, [financialRanges]);

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
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.source_type')}</FormLabel>
                      <FormMessage />
                    </div>
                  )}
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sources_of_wealth(t).map((option: { id: string; label: string }) => (
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
                  {index === 0 && 
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.percentage')}</FormLabel>
                      <FormMessage />
                    </div>
                  }
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
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ sourceType: '', percentage: 0 })}>
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.financial.add_source')}
        </Button>
      </div>
    );
  };

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
                  {index === 0 && 
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.asset_class')}</FormLabel>
                      <FormMessage />
                    </div>
                  }
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asset_classes(t).map((opt) => (
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
                  {index === 0 && 
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.years_trading')}</FormLabel>
                      <FormMessage />
                    </div>
                  }
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
                  {index === 0 && 
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.trades_per_year')}</FormLabel>
                      <FormMessage />
                    </div>
                  }
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
                    {index === 0 && 
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>{t('apply.account.financial.knowledge_level')}</FormLabel>
                      <FormMessage />
                    </div>
                  }
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {knowledge_levels(t).map((lvl) => (
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
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ assetClass: 'STK', yearsTrading: 1, tradesPerYear: 10, knowledgeLevel: 'Limited' })}>
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.financial.add_experience')}
        </Button>
      </div>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.financial.financial_information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold">{t('apply.account.financial.financial_information')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accounts.0.baseCurrency"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-2 items-center">
                    <FormLabel>{t('apply.account.financial.base_currency')}</FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency: { value: string; label: string }) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-row gap-2 items-center">
            <h4 className="text-lg font-semibold">
              {t('apply.account.financial.trading_permissions')}
            </h4>
            {tradingPermissions.length === 0 && (
              <p className="text-md text-primary font-medium">Required</p>
            )}
          </div>
          <p className="text-subtitle text-sm mb-4">
            {t('apply.account.financial.trading_permissions_description')}
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trading_products(t).map((product) => {
                const isSelected = tradingPermissions.some(p => p.product === product.id);
                return (
                  <div key={product.id} className="flex items-center space-x-2 border p-4 rounded-md">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => toggleProduct(product.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                    >
                      {product.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <h1 className="text-lg font-semibold">
          Wealth Information
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.0.netWorth` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.financial.net_worth')} (USD)</FormLabel>
                  <FormMessage />
                </div>
                <p className="text-xs text-subtitle">{t('apply.account.financial.net_worth_help')}</p>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rangeByType.netWorth.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {formatRangeLabel(range)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.0.liquidNetWorth` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.financial.liquid_net_worth')} (USD)</FormLabel>
                  <FormMessage />
                </div>
                <p className="text-xs text-subtitle">{t('apply.account.financial.liquid_net_worth_help')}</p>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rangeByType.liquidNetWorth.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {formatRangeLabel(range)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.0.annualNetIncome` as any}
            render={({ field }) => (
              <FormItem>  
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.financial.annual_net_income')} (USD)</FormLabel>
                  <FormMessage />
                </div>
                <p className="text-xs text-subtitle">{t('apply.account.financial.annual_net_income_help')}</p>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rangeByType.annualNetIncome.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {formatRangeLabel(range)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Investment Objectives – editable list */}
        <FormField
          control={form.control}
          name={`${basePath}.0.investmentObjectives` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.financial.investment_objectives')}</FormLabel>
                <FormMessage />
              </div>
              <FormDescription>{t('apply.account.financial.investment_objectives_description')}</FormDescription>
              <div className="flex flex-col space-y-2">
                {investment_objectives(t).map((option: { id: string; label: string }) => {
                  const checked = (field.value || []).includes(option.id);
                  return (
                    <label key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          let newValue: string[] = Array.isArray(field.value) ? [...field.value] : [];
                          if (isChecked) {
                            if (!newValue.includes(option.id)) newValue.push(option.id);
                          } else {
                            newValue = newValue.filter((v) => v !== option.id);
                          }
                          field.onChange(newValue);

                          // Keep account-level investment objectives in sync
                          form.setValue('accounts.0.investmentObjectives' as any, newValue);
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        {/* Investment Experience */}
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <h4 className="text-lg font-semibold">
              {t('apply.account.financial.investment_experience')}
            </h4>
          </div>
          <InvestmentExperienceFields basePath={basePath} />
        </div>

        {/* Source of Wealth */}
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <h4 className="text-lg font-semibold">
              {t('apply.account.financial.source_of_wealth')}
            </h4>
          </div>
          <SourcesOfWealthFields basePath={basePath} />
        </div>

        {/* Estimated Deposit */}
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <Label className={cn(estimatedDepositError && "text-destructive")}>
              {t('apply.account.financial.estimated_deposit')}
            </Label>
            {estimatedDepositError && (
              <p className={cn("text-md font-medium text-primary")}>
                {estimatedDepositError}
              </p>
            )}
          </div>
          <Input 
            value={estimatedDeposit ?? ''} 
            onChange={(e) => setEstimatedDeposit(e.target.value === '' ? null : parseInt(e.target.value))} 
            className={cn(estimatedDepositError && "border-destructive focus-visible:ring-destructive")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialInfoStep;
