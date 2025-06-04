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
import { Checkbox } from "@/components/ui/checkbox";
import { phone_types as getPhoneTypes, id_type as getIdTypes } from '@/lib/form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';

interface AccountHolderInfoStepProps {
  form: UseFormReturn<Application>;
}

const AccountHolderInfoStep: React.FC<AccountHolderInfoStepProps> = ({ form }) => {
  const { t } = useTranslationProvider();
  const phoneTypeOptions = getPhoneTypes(t);
  const idTypeOptions = getIdTypes(t);

  return (
    <>
      <h2 className="text-2xl font-semibold">Account Holder Information</h2>
      {/* Name Fields */}
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.name.first"
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
        name="customer.accountHolder.accountHolderDetails.0.name.last"
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
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.email"
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
      <h3 className="text-xl font-semibold pt-4">Residence Address</h3>
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.residenceAddress.street1"
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
        name="customer.accountHolder.accountHolderDetails.0.residenceAddress.street2"
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
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.residenceAddress.city"
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
        name="customer.accountHolder.accountHolderDetails.0.residenceAddress.state"
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
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.residenceAddress.postalCode"
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
          name: "customer.accountHolder.accountHolderDetails.0.residenceAddress.country",
          title: "Country"
        }}
      />
      <h3 className="text-xl font-semibold pt-4">Contact Information (Primary Phone)</h3>
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.phones.0.type"
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
          name: "customer.accountHolder.accountHolderDetails.0.phones.0.country",
          title: "Phone Country Code"
        }}
      />
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.phones.0.number"
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
      <h3 className="text-xl font-semibold pt-4">Identification</h3>
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.identification.type"
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
            <FormDescription>
              Note: Values from this list (e.g., 'ID', 'License') may need mapping to schema-expected values (e.g., 'NATIONAL_ID', 'DRIVERS_LICENSE') for IBKR compatibility.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.identification.nationalId"
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
      <CountriesFormField
        form={form}
        element={{
          name: "customer.accountHolder.accountHolderDetails.0.identification.issuingCountry",
          title: "Issuing Country"
        }}
      />
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.identification.expirationDate"
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
      <h3 className="text-xl font-semibold pt-4">Employment Details</h3>
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.employmentType"
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
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.employmentDetails.employer"
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
        name="customer.accountHolder.accountHolderDetails.0.employmentDetails.employerBusiness"
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
      <FormField
        control={form.control}
        name="customer.accountHolder.accountHolderDetails.0.employmentDetails.occupation"
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
      <Button type="submit" className="mt-8">
        Submit
      </Button>
    </>
  );
};

export default AccountHolderInfoStep;
