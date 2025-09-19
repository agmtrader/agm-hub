import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { investment_objectives as getInvestmentObjectives, products_complete as getProductsComplete } from '@/lib/public/form';

interface AccountInformationStepProps {
  form: UseFormReturn<Application>;
}

const AccountInformationStep = ({ form }: AccountInformationStepProps) => {
  const { t } = useTranslationProvider();
  const investmentObjectivesOptions = getInvestmentObjectives(t);
  const productsCompleteOptions = getProductsComplete(t);

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_holder_info.account_setup')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Currency */}
          <FormField
            control={form.control}
            name="accounts.0.baseCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.base_currency')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">{t('apply.account.account_holder_info.usd')}</SelectItem>
                    <SelectItem value="EUR">{t('apply.account.account_holder_info.eur')}</SelectItem>
                    <SelectItem value="GBP">{t('apply.account.account_holder_info.gbp')}</SelectItem>
                    <SelectItem value="CAD">{t('apply.account.account_holder_info.cad')}</SelectItem>
                    <SelectItem value="AUD">{t('apply.account.account_holder_info.aud')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Margin or Cash */}
          <FormField
            control={form.control}
            name="accounts.0.margin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.account_type')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">{t('apply.account.account_holder_info.cash_account')}</SelectItem>
                    <SelectItem value="Margin">{t('apply.account.account_holder_info.margin_account')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Investment Objectives – read-only display synced from Financial Info */}
        <FormField
          control={form.control}
          name="accounts.0.investmentObjectives"
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

        {/* Trading Permissions */}
        <h4 className="text-lg font-semibold">
          {t('apply.account.account_holder_info.trading_permissions')}
        </h4>
        <p className="text-subtitle text-sm mb-4">
          {t('apply.account.account_holder_info.trading_permissions_description')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accounts.0.tradingPermissions.0.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.primary_trading_market')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UNITED STATES">{t('apply.account.account_holder_info.united_states')}</SelectItem>
                    <SelectItem value="CANADA">{t('apply.account.account_holder_info.canada')}</SelectItem>
                    <SelectItem value="UNITED KINGDOM">{t('apply.account.account_holder_info.united_kingdom')}</SelectItem>
                    <SelectItem value="GERMANY">{t('apply.account.account_holder_info.germany')}</SelectItem>
                    <SelectItem value="JAPAN">{t('apply.account.account_holder_info.japan')}</SelectItem>
                    <SelectItem value="AUSTRALIA">{t('apply.account.account_holder_info.australia')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accounts.0.tradingPermissions.0.product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_holder_info.product_types')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productsCompleteOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformationStep;
