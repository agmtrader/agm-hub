import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { account_types, currencies, products } from '@/lib/public/form';

interface AccountInformationStepProps {
  form: UseFormReturn<Application>;
}

const AccountInformationStep = ({ form }: AccountInformationStepProps) => {
  
  const { t } = useTranslationProvider();

  // FieldArray for trading permissions
  const { fields: tpFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'accounts.0.tradingPermissions',
  });

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_setup.account_setup')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <FormField
            control={form.control}
            name="accounts.0.baseCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_setup.base_currency')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accounts.0.margin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('apply.account.account_setup.account_type')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {account_types(t).map((option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
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

        <h4 className="text-lg font-semibold">
          {t('apply.account.account_setup.trading_permissions')}
        </h4>
        <p className="text-subtitle text-sm mb-4">
          {t('apply.account.account_setup.trading_permissions_description')}
        </p>

        <div className="space-y-4">
          {tpFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_auto] gap-4 items-end">
              <FormField
                control={form.control}
                name={`accounts.0.tradingPermissions.${index}.country` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.account.account_setup.primary_trading_market')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UNITED STATES">{t('apply.account.account_setup.united_states')}</SelectItem>
                        <SelectItem value="CANADA">{t('apply.account_setup.canada')}</SelectItem>
                        <SelectItem value="UNITED KINGDOM">{t('apply.account.account_setup.united_kingdom')}</SelectItem>
                        <SelectItem value="GERMANY">{t('apply.account.account_setup.germany')}</SelectItem>
                        <SelectItem value="JAPAN">{t('apply.account.account_setup.japan')}</SelectItem>
                        <SelectItem value="AUSTRALIA">{t('apply.account_setup.australia')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product */}
              <FormField
                control={form.control}
                name={`accounts.0.tradingPermissions.${index}.product` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.account.account_setup.product_types')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products(t).map((option: { id: string; label: string }) => (
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
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive self-start sm:mt-0"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ country: '', product: '' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('apply.account.account_setup.add_trading_permission')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformationStep;
