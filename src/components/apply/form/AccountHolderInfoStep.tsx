import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import CountriesFormField from "@/components/ui/CountriesFormField";
import { Application } from "@/lib/entities/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phone_types as getPhoneTypes, id_type as getIdTypes } from '@/lib/public/form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card } from "@/components/ui/card";

interface AccountHolderInfoStepProps {
  form: UseFormReturn<Application>;
}

const AccountHolderInfoStep = ({ form }: AccountHolderInfoStepProps) => {
  const { t } = useTranslationProvider();
  const phoneTypeOptions = getPhoneTypes(t);
  const idTypeOptions = getIdTypes(t);

  const accountType = form.watch("customer.type");

  // Render form fields for a single account holder
  const renderAccountHolderFields = (basePath: string, title: string) => (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.name.first` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.name.last` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`${basePath}.email` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of Birth and Country of Birth */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.dateOfBirth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (YYYY-MM-DD)</FormLabel>
              <FormControl>
                <Input type="date" placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.countryOfBirth`,
            title: "Country of Birth"
          }}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Residence Address</h4>
      <FormField
        control={form.control}
        name={`${basePath}.residenceAddress.street1` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address 1</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${basePath}.residenceAddress.street2` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address 2 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.residenceAddress.city` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.residenceAddress.state` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province/Region</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.residenceAddress.postalCode` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.residenceAddress.country`,
            title: "Country"
          }}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Contact Information (Primary Phone)</h4>
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.phones.0.type` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {phoneTypeOptions.map((option: { label: string; value: string }) => (
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
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.phones.0.country`,
            title: "Phone Country Code"
          }}
        />
        <FormField
          control={form.control}
          name={`${basePath}.phones.0.number` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Identification</h4>
      <FormField
        control={form.control}
        name={`${basePath}.identification.type` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {idTypeOptions.map((option: { label: string; value: string }) => (
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
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.identification.nationalId` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.identification.expirationDate` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (YYYY-MM-DD)</FormLabel>
              <FormControl>
                <Input type="date" placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <CountriesFormField
        form={form}
        element={{
          name: `${basePath}.identification.issuingCountry`,
          title: "Issuing Country"
        }}
      />

      <h4 className="text-lg font-semibold pt-4">Employment Details</h4>
      <FormField
        control={form.control}
        name={`${basePath}.employmentType` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[{ value: 'EMPLOYED', label: 'Employed' }, { value: 'SELF_EMPLOYED', label: 'Self-employed' }, { value: 'UNEMPLOYED', label: 'Unemployed' }, { value: 'STUDENT', label: 'Student' }, { value: 'RETIREE', label: 'Retiree' }, { value: 'OTHER', label: 'Other' }].map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.employmentDetails.employer` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employer</FormLabel>
              <FormControl>
                <Input placeholder="Enter employer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.employmentDetails.occupation` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Enter occupation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${basePath}.employmentDetails.employerBusiness` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Business</FormLabel>
            <FormControl>
              <Input placeholder="Enter employer business" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Account Holder Information</h2>
        <p className="text-subtitle">
          {accountType === 'JOINT' 
            ? 'Please provide information for both account holders' 
            : 'Please provide your account holder information'
          }
        </p>
      </div>

      {accountType === 'JOINT' ? (
        <div className="space-y-6">
          {/* Joint Account Type Selection */}
          <Card className="p-6">
            <FormField
              control={form.control}
              name="customer.jointHolders.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joint Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select joint account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="community">Community Property</SelectItem>
                      <SelectItem value="joint_tenants">Joint Tenants with Rights of Survivorship</SelectItem>
                      <SelectItem value="tenants_common">Tenants in Common</SelectItem>
                      <SelectItem value="tbe">Tenants by the Entirety</SelectItem>
                      <SelectItem value="au_joint_account">AU Joint Account</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          {/* First Holder */}
          {renderAccountHolderFields("customer.jointHolders.firstHolderDetails.0", "First Account Holder")}
          
          {/* Second Holder */}
          {renderAccountHolderFields("customer.jointHolders.secondHolderDetails.0", "Second Account Holder")}
        </div>
      ) : (
        // Individual Account
        renderAccountHolderFields("customer.accountHolder.accountHolderDetails.0", "Account Holder Information")
      )}
    </div>
  );
};

export default AccountHolderInfoStep;
