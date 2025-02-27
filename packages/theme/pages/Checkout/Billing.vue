<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <SfHeading
      v-e2e="'heading-billing'"
      :level="3"
      :title="$t('Billing address')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <form
      @submit.prevent="
        handleSubmit(handleAddressSubmit(reset))
      "
    >
      <UserBillingAddresses
        v-if="isAuthenticated && hasSavedBillingAddress"
        v-model="setAsDefault"
        :currentAddressId="currentAddressId || NOT_SELECTED_ADDRESS"
        @setCurrentAddress="handleSetCurrentAddress"
      />
      <SfCheckbox
        v-e2e="'copy-address'"
        :selected="sameAsShipping"
        @change="handleCheckSameAddress"
        label="Copy address data from shipping"
        name="copyShippingAddress"
        class="form__element"
      />
      <div class="form" v-if="canAddNewAddress">
        <ValidationProvider
          name="firstName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'firstName'"
            :value="billingDetails.firstName"
            @input="firstName => changeBillingDetails('firstName', firstName)"
            label="First name"
            name="firstName"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="lastName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'lastName'"
            :value="billingDetails.lastNameOrSurname"
            @input="lastName => changeBillingDetails('lastNameOrSurname', lastName)"
            label="Last name"
            name="lastName"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider
          name="streetName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'streetName'"
            :value="billingDetails.address && billingDetails.address.address1"
            @input="streetName => changeBillingDetails('address1', streetName)"
            label="Street name"
            name="streetName"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="apartment"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'apartment'"
            :value="billingDetails.address && billingDetails.address.address2"
            @input="apartment => changeBillingDetails('address2', apartment)"
            label="House/Apartment number"
            name="apartment"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="city"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'city'"
            :value="billingDetails.address && billingDetails.address.cityOrTown"
            @input="city => changeBillingDetails('cityOrTown', city)"
            label="City"
            name="city"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="state"
          :rules="!statesInSelectedCountry ? null : 'required|min:2'"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'state'"
            :value="billingDetails.address && billingDetails.address.stateOrProvince"
            @input="state => changeBillingDetails('stateOrProvince', state)"
            label="State/Province"
            name="state"
            class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            :disabled="!statesInSelectedCountry"
          >
            <SfSelectOption
              v-for="state in statesInSelectedCountry"
              :key="state"
              :value="state"
            >
              {{ state }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'country'"
            :value="billingDetails.address && billingDetails.address.countryCode"
            @input="country => changeBillingDetails('countryCode', country)"
            label="Country"
            name="country"
            class="form__element form__element--half form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryOption in countries"
              :key="countryOption.name"
              :value="countryOption.name"
            >
              {{ countryOption.label }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="zipCode"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'zipcode'"
            :value="billingDetails.address && billingDetails.address.postalOrZipCode"
            @input="postalCode => changeBillingDetails('postalOrZipCode', postalCode)"
            label="Zip-code"
            name="zipCode"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider
          name="phone"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'phone'"
            :value="billingDetails.phoneNumbers && billingDetails.phoneNumbers.home"
            @input="phone => changeBillingDetails('home', phone)"
            label="Phone number"
            name="phone"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider
          name="email"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'email'"
            :value="billingDetails.email && billingDetails.email"
            @input="email => changeBillingDetails('email', email)"
            label="Email address"
            name="email"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <SfButton
        v-if="!canAddNewAddress"
        class="color-light form__action-button form__action-button--add-address"
        type="submit"
        @click.native="handleAddNewAddressBtnClick"
      >
        {{ $t('Add new address') }}
      </SfButton>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-e2e="'continue-to-payment'"
            class="form__action-button"
            type="submit"
            :disabled="!canMoveForward"
          >
            {{ $t('Continue to payment') }}
          </SfButton>
          <nuxt-link
            to="/checkout/shipping"
            class="sf-button sf-button--underlined form__back-button smartphone-only"
            >Go back</nuxt-link>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio,
  SfCheckbox
} from '@storefront-ui/vue';
import { useUserBilling, userBillingGetters, useUser, useBilling, useShipping } from '@vue-storefront/kibocommerce';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, min, digits } from 'vee-validate/dist/rules';
import { useVSFContext } from '@vue-storefront/core';
import { ref, watch, computed, onMounted, useRouter } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import '@/helpers/validators/phone';

const NOT_SELECTED_ADDRESS = '';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

export default {
  name: 'Billing',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver,
    UserBillingAddresses: () => import('@/components/Checkout/UserBillingAddresses')
  },
  setup() {
    const router = useRouter();
    const { $kibo: { config } } = useVSFContext();
    const { shipping: shippingDetails, load: loadShipping } = useShipping();
    const { billing: address, loading, load, save } = useBilling();
    const { isAuthenticated } = useUser();
    const { billing: userBilling, load: loadUserBilling, setDefaultAddress } = useUserBilling();
    const billingDetails = ref(address.value || {});

    const currentAddressId = ref(NOT_SELECTED_ADDRESS);
    const setAsDefault = ref(false);
    const canAddNewAddress = ref(true);
    const sameAsShipping = ref(false);
    let oldBilling = null;

    const canMoveForward = computed(() => !loading.value && billingDetails.value && Object.keys(billingDetails.value).length);

    const statesInSelectedCountry = computed(() => {
      if (!billingDetails.value.address?.countryCode) {
        return null;
      }
      const selectedCountry = config.countries.find(country => country.name === billingDetails.value.address?.countryCode);
      return selectedCountry && selectedCountry.states;
    });

    const hasSavedBillingAddress = computed(() => {
      if (!isAuthenticated.value || !userBilling.value) {
        return false;
      }
      const addresses = userBillingGetters.getAddresses(userBilling.value);
      return Boolean(addresses?.length);
    });

    const handleCheckSameAddress = async () => {
      sameAsShipping.value = !sameAsShipping.value;
      if (sameAsShipping.value) {
        if (!shippingDetails.value) {
          await loadShipping();
        }
        oldBilling = {...billingDetails.value};
        billingDetails.value = {...shippingDetails.value};
        currentAddressId.value = NOT_SELECTED_ADDRESS;
        setAsDefault.value = false;
        return;
      }
      billingDetails.value = oldBilling;
    };

    const handleAddressSubmit = (reset) => async () => {
      const addressId = currentAddressId.value;
      await save({
        billingDetails: {
          ...billingDetails.value,
          sameAsShipping: sameAsShipping.value
        }
      });
      if (addressId !== NOT_SELECTED_ADDRESS && setAsDefault.value) {
        const chosenAddress = userBillingGetters.getAddresses(userBilling.value, { id: addressId });
        if (chosenAddress && chosenAddress.length) {
          await setDefaultAddress({ address: chosenAddress[0] });
        }
      }
      reset();
      router.push('/checkout/payment');
    };

    const handleAddNewAddressBtnClick = () => {
      currentAddressId.value = NOT_SELECTED_ADDRESS;
      canAddNewAddress.value = true;
    };

    const handleSetCurrentAddress = address => {
      billingDetails.value = {...address};
      currentAddressId.value = address.id;
      canAddNewAddress.value = false;
      sameAsShipping.value = false;
    };

    const changeBillingDetails = (field, value) => {
      // billingDetails.value = {...billingDetails.value, [field]: value};

      const addressList = ['address1', 'address2', 'addressType', 'cityOrTown', 'stateOrProvince', 'postalOrZipCode', 'countryCode', 'isValidated'];
      const phoneList = ['home'];

      if (addressList.includes(field)) {
        billingDetails.value = {
          ...billingDetails.value
        };

        billingDetails.value.address[field] = value;

      } else if (phoneList.includes(field)) {
        billingDetails.value = {
          ...billingDetails.value
        };

        billingDetails.value.phoneNumbers[field] = value;
      } else {

        billingDetails.value = {
          ...billingDetails.value,
          [field]: value
        };
      }

      currentAddressId.value = NOT_SELECTED_ADDRESS;
    };

    const selectDefaultAddress = () => {
      const defaultAddress = userBillingGetters.getAddresses(userBilling.value, { isDefault: true });
      if (defaultAddress && defaultAddress.length) {
        handleSetCurrentAddress(defaultAddress[0]);
      }
    };

    // Update local state if we have new address' response from the backend
    watch(address, addr => {
      billingDetails.value = addr || {};
    });

    watch(statesInSelectedCountry, statesInSelectedCountry => {
      const countryHasStates = statesInSelectedCountry && statesInSelectedCountry.length;
      if (!countryHasStates && billingDetails.value.state) {
        billingDetails.value.state = null;
      }
    });

    onSSR(async () => {
      await load();
      if (isAuthenticated.value) {
        await loadUserBilling();
      }
    });

    onMounted(async () => {
      if (!userBilling.value?.addresses && isAuthenticated.value) {
        await loadUserBilling();
      }
      const billingAddresses = userBillingGetters.getAddresses(userBilling.value);
      if (!billingAddresses || !billingAddresses.length) {
        return;
      }
      const hasEmptyBillingDetails = !billingDetails.value || Object.keys(billingDetails.value).length === 0;
      if (hasEmptyBillingDetails) {
        selectDefaultAddress();
        return;
      }
      canAddNewAddress.value = false;
    });

    return {
      NOT_SELECTED_ADDRESS,
      isAuthenticated,
      billingDetails,
      countries: config.countries,
      setAsDefault,
      canAddNewAddress,
      currentAddressId,
      hasSavedBillingAddress,
      handleAddressSubmit,
      handleAddNewAddressBtnClick,
      handleSetCurrentAddress,
      handleCheckSameAddress,
      changeBillingDetails,
      sameAsShipping,
      shippingDetails,
      statesInSelectedCountry,
      loading,
      canMoveForward
    };
  }
};
</script>
<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  --heading-title-font-weight: var(--font-weight--bold);
}
.form {
  &__select {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }

    ::v-deep .sf-select__label {
      left: initial;
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    width: 100%;
    @include for-desktop {
      width: 25rem;
    }
     &--add-address {
      width: 100%;
      margin: 0 0 var(--spacer-sm) 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    width: 100%;
    margin: var(--spacer-sm) 0 var(--spacer-xl);
    &:hover {
      color:  white;
    }
  }
}
</style>
