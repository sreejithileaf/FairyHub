// /**
//  * Created by iLeaf Solutions Pvt.Ltd
//  * on February 19, 2020
//  * AddAddressView - In this screen user can add/edit their address.
//  */

// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import Styles from "./style";
// import React, { Component } from "react";
// import Images from "../../config/images";
// import { isEmpty } from "../../config/common";
// import Countries from "../../lib/countires.js";
// import HudView from "../../components/hudView";
// import constants from "../../config/constants";
// import CountryPicker from "react-native-country-picker-modal";
// import { translate } from "../../config/languageSwitching/index";
// import FloatingLabelInput from "../../components/FloatingLabelInput";
// import {
//   showSingleAlert,
//   checkPhoneNumberValid,
//   normalizedWidth,
// } from "../../config/common";
// import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";
// import BottomButton from "../../components/BottomButton";

// let countryFromAddress = "";
// class GuestAddAddressView extends Component {
//   constructor(props) {
//     super(props);
//     const { details, edit } = props.navigation.state.params;
//     const { storeCode } = props;
//     console.log("details", details);
//     let streetAddress = "";

//     if (edit)
//       details.street.map((item) => {
//         streetAddress = streetAddress + item + "\n";
//       });

//     if (
//       props.navigation.state.params.isFromGuestCheckout &&
//       details &&
//       details.street
//     ) {
//       details.street.map((item) => {
//         streetAddress = streetAddress + item + "\n";
//       });
//     }

//     let countryName = "Kuwait";
//     let callingCode = "965";
//     let countryCode = "KW";

//     if (details.country_id && details.country_id !== "") {
//       countryCode = details.country_id;
//       countryName = Countries[countryCode].name.common;
//       callingCode = Countries[countryCode].callingCode;
//     }

//     this.state = {
//       availableCountries: [],
//       availableRegions: [],
//       countryRegions: [],
//       isFormValid: true,
//       regionID: "",
//       isEdit: edit,
//       isShowCountryPicker: false,
//       countryName: countryName,
//       callingCode: callingCode,
//       countryCode: countryCode,
//       maxVal: 200,
//       textLength: 0,
//       useDifferentAddressForBilling: false,

//       formFeilds: {
//         firstname: {
//           text: details.firstname || "",
//           valid:
//             details.firstname && !isEmpty(details.firstname) ? true : false,
//         },
//         lastname: {
//           text: details.lastname || "",
//           valid: details.lastname && !isEmpty(details.lastname) ? true : false,
//         },
//         city: {
//           text: details.city || "",
//           valid: details.city && !isEmpty(details.city) ? true : false,
//         },
//         address: {
//           text: details && details.street ? streetAddress : "",
//           valid:
//             details && details.street && streetAddress.length > 0
//               ? true
//               : false,
//         },
//         zipcode: {
//           text: details.postcode || "",
//           valid: details.postcode && !isEmpty(details.postcode) ? true : false,
//         },
//         mobile: {
//           text: details.telephone || "",
//           valid:
//             details.telephone && !isEmpty(details.telephone) ? true : false,
//         },
//         country_state: {
//           text: details.country_state || "",
//           valid: true,
//         },
//         country: {
//           text: countryFromAddress || "",
//           countryID: details.country_id || "",
//           valid: countryName !== "",
//           // countryFromAddress && !isEmpty(countryFromAddress) ? true : false,
//         },
//       },
//     };
//   }

//   componentDidMount() {}

//   componentWillUnmount() {
//     countryFromAddress = "";
//   }
//   didTapOnBackButton = () => {
//     this.props.navigation.goBack();
//   };

//   validateInput = (text, fieldname) => {
//     let stateObject = {
//       text: text,
//       valid: text.length !== 0,
//     };
//     let formfeilds = this.state.formFeilds;
//     formfeilds[fieldname] = stateObject;
//     this.setState({ formFeilds: formfeilds });
//     if (fieldname === "address") {
//       this.setState({ textLength: text.length });
//     }
//   };

//   selectedRegion = (region) => {
//     let stateObject = {
//       text: region[0].name.toString(),
//       id: region[0].id,
//       valid: true,
//     };

//     let formfeilds = this.state.formFeilds;
//     formfeilds["country_state"] = stateObject;
//     this.setState({ formFeilds: formfeilds, regionID: region[0].id });
//   };

//   saveAddress = () => {
//     console.log("address", this.state.formFeilds);
//     let isFromGuestCheckout = this.props.navigation.state.params
//       .isFromGuestCheckout
//       ? this.props.navigation.state.params.isFromGuestCheckout
//       : false;

//     if (isFromGuestCheckout) {
//       const {
//         firstname,
//         lastname,
//         city,
//         address,
//         zipcode,
//         mobile,
//         country_state,
//         country,
//       } = this.state.formFeilds;

//       const { countryCode } = this.state;

//       console.log("address", this.state.formFeilds);

//       let newAddress = {
//         region_id: country_state.id || 0,
//         country_id: countryCode,
//         street: [address.text],
//         firstname: firstname.text,
//         lastname: lastname.text,
//         company: "",
//         telephone: mobile.text,
//         city: city.text,
//         postcode: zipcode.text,
//       };
//       const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
//         return !this.state.formFeilds[item].valid;
//       });
//       this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

//       if (filledFeilds.length === 0) {
//         if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
//           showSingleAlert(translate("Please enter a valid phone number"));
//           return;
//         }
//       }
//       if (filledFeilds.length === 0) {
//         this.props.navigation.state.params.addAddressCallback(newAddress);
//         this.props.navigation.goBack();
//       } else {
//         showSingleAlert(translate("Please fill the mandatory fields"));
//       }
//     } else {
//       const { mobile } = this.state.formFeilds;

//       const { countryCode } = this.state;
//       const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
//         return !this.state.formFeilds[item].valid;
//       });
//       this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

//       if (filledFeilds.length === 0) {
//         if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
//           showSingleAlert(translate("Please enter a valid phone number"));
//           return;
//         }
//       }

//       if (filledFeilds.length === 0) {
//         this.callAddressAction();
//       } else {
//         showSingleAlert(translate("Please fill the mandatory fields"));
//       }
//     }
//   };

//   callAddressAction = () => {
//     const { guestAddressList } = this.props;
//     const { isEdit } = this.state;
//     const { details } = this.props.navigation.state.params;

//     const isFromCheckOutScreen = this.props.navigation.state.params
//       .isFromCheckOutScreen;
//     const isBillingAddress = this.props.navigation.state.params
//       .isBillingAddress;

//     let userAddress = [];

//     const store_id = 1;
//     const {
//       firstname,
//       lastname,
//       city,
//       address,
//       zipcode,
//       mobile,
//       country_state,
//       country,
//     } = this.state.formFeilds;
//     const { countryCode } = this.state;

//     let textArray = address.text.split("↵");
//     let textArray2 = address.text.split("\n");

//     let stringarray = [];
//     textArray2.forEach((element) => {
//       if (element.length > 0) {
//         stringarray.push(element.trim());
//       }
//     });

//     if (stringarray.length > 3) {
//       showSingleAlert(translate("Address cannot contain more than 3 lines"));
//       return;
//     }

//     let newAddress = {
//       region_id: country_state.id || 0,
//       country_id: countryCode, //country.countryID.trim(),
//       street: stringarray,
//       firstname: firstname.text.trim(),
//       lastname: lastname.text.trim(),
//       company: "",
//       telephone: mobile.text.trim(),
//       city: city.text.trim(),
//       postcode: zipcode.text.trim(),
//       default_billing: true,
//       default_shipping: true,
//       id: isBillingAddress ? 2 : 1,
//     };

//     let addresses = [];

//     if (isFromCheckOutScreen && isBillingAddress) {
//       newAddress.default_billing = true;
//       let shippingAddress = guestAddressList[0];
//       shippingAddress.default_billing = false;
//       newAddress.default_shipping = false;
//       addresses.push(newAddress);
//       addresses.push(shippingAddress);
//     } else {
//       addresses.push(newAddress);
//     }

//     if (isEdit) {
//       let itemIndex;
//       userAddress = guestAddressList;
//       userAddress.map((item, i) => {
//         if (item.id === details.id) itemIndex = i;
//       });

//       newAddress["default_billing"] = details["default_billing"];
//       newAddress["default_shipping"] = details["default_shipping"];
//       userAddress[itemIndex] = newAddress;
//     }

//     const editAddresses = userAddress;
//     console.log("addresses", addresses);

//     let request = isEdit ? editAddresses : addresses;

//     console.log("guest addresses", request);

//     if (isEdit) {
//       this.props.editAddressUser(request);
//       this.editAddressCallback(true);
//     } else {
//       this.props.addAddressUser(request);
//       this.addAddressCallback(true);
//     }
//   };

//   editAddressCallback = (status) => {
//     if (status) {
//       showSingleAlert("Successfully Updated", "OK", () => {
//         const guestAddressUpdateCallback = this.props.navigation.state.params
//           .guestAddressUpdateCallback;
//         guestAddressUpdateCallback();
//         this.props.navigation.goBack();
//       });
//     }
//   };

//   addAddressCallback = (status) => {
//     if (status) {
//       showSingleAlert("Successfully Added", "OK", () => {
//         const isFromCheckOutScreen = this.props.navigation.state.params
//           .isFromCheckOutScreen;

//         const isFromProductsDetailScreen = this.props.navigation.state.params
//           .isFromProductsDetailScreen;
//         const totalCost = this.props.navigation.state.params.totalCost;

//         if (isFromCheckOutScreen) {
//           if (this.state.useDifferentAddressForBilling) {
//             this.props.navigation.push("GuestAddAddress", {
//               details: {},
//               isBillingAddress: true,
//               totalCost: totalCost,
//               isFromCheckOutScreen: true,
//               isFromProductsDetailScreen,
//             });
//           } else {
//             this.props.navigation.navigate("Checkout", {
//               totalCost,
//               isFromAddAddress: true,
//               isFromProductDetail: true,
//               isFromProductsDetailScreen,
//             });
//           }
//         } else {
//           this.props.navigation.goBack();
//         }
//       });
//     }
//   };

//   render() {
//     const {
//       firstname,
//       lastname,
//       city,
//       address,
//       zipcode,
//       mobile,
//       country_state,
//       country,
//     } = this.state.formFeilds;

//     const { isShowCountryPicker, countryName, callingCode } = this.state;
//     const { isRTL } = this.props;
//     const {
//       isFormValid,
//       countryRegions,
//       isEdit,
//       availableRegions,
//       useDifferentAddressForBilling,
//     } = this.state;

//     const isFromCheckOutScreen = this.props.navigation.state.params
//       .isFromCheckOutScreen;

//     const isBillingAddress = this.props.navigation.state.params
//       .isBillingAddress;

//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//         <NavigationHeader1
//           hideSearch={true}
//           title={
//             isEdit
//               ? translate("Edit Address")
//               : isBillingAddress
//               ? translate("Add Billing Address")
//               : translate("Add Address")
//           }
//           showBackButton={true}
//           didTapOnLeftButton={this.didTapOnBackButton}
//           isRTL={isRTL}
//         />
//         {/* <Text style={Styles.titleStyle}>{isEdit ? translate("Edit Address") : translate("Add Address")}</Text> */}
//         <ScrollView>
//           <View style={{ paddingHorizontal: 40, paddingVertical: 35 }}>
//             <FloatingLabelInput
//               label={
//                 <Text>
//                   {translate("First Name")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               value={firstname.text}
//               onChangeText={(text) => {
//                 this.validateInput(text, "firstname");
//               }}
//               maxLength={30}
//               returnKeyType={"next"}
//               onSubmitEditing={() => this.lastNameRef.focus()}
//               style={
//                 !firstname.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//           </View>
//           <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
//             <FloatingLabelInput
//               label={
//                 <Text>
//                   {translate("Last Name")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               value={lastname.text}
//               onChangeText={(text) => {
//                 this.validateInput(text, "lastname");
//               }}
//               // placeholder={translate("Last Name")}
//               ref={(ref) => (this.lastNameRef = ref)}
//               maxLength={30}
//               returnKeyType={"next"}
//               onSubmitEditing={() => this.addressRef.focus()}
//               style={
//                 !lastname.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//           </View>

//           <View style={{ paddingHorizontal: 40 }}>
//             <FloatingLabelInput
//               value={address.text}
//               multiline={true}
//               numberOfLines={4}
//               onChangeText={(text) => {
//                 this.validateInput(text, "address");
//               }}
//               label={
//                 <Text>
//                   {translate("Address")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               ref={(ref) => (this.addressRef = ref)}
//               maxLength={200}
//               returnKeyType={"next"}
//               style={
//                 !address.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//             <Text style={Styles.lettermax}>
//               {this.state.maxVal - this.state.textLength}{" "}
//               {translate("letters maximum")}
//             </Text>
//           </View>

//           <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
//             <FloatingLabelInput
//               value={city.text}
//               onChangeText={(text) => {
//                 this.validateInput(text, "city");
//               }}
//               label={
//                 <Text>
//                   {translate("City/Emirate")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               ref={(ref) => (this.cityRef = ref)}
//               maxLength={30}
//               returnKeyType={"next"}
//               onSubmitEditing={() => this.zipCodeRef.focus()}
//               style={
//                 !city.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//           </View>

//           <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
//             <FloatingLabelInput
//               value={zipcode.text}
//               keyboardType={"numeric"}
//               onChangeText={(text) => {
//                 this.validateInput(text, "zipcode");
//               }}
//               label={
//                 <Text>
//                   {translate("Zip")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               ref={(ref) => (this.zipCodeRef = ref)}
//               maxLength={10}
//               returnKeyType={"next"}
//               style={
//                 !zipcode.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//           </View>

//           <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
//             <FloatingLabelInput
//               disabled
//               value={countryName}
//               // onChangeText={(text) => {
//               // 	this.validateInput(text, "city");
//               // }}
//               label={
//                 <Text>
//                   {translate("Country")}
//                   <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                 </Text>
//               }
//               // ref={(ref) => (this.cityRef = ref)}
//               maxLength={30}
//               returnKeyType={"next"}
//               // onSubmitEditing={() => this.zipCodeRef.focus()}
//               style={
//                 !country.valid && !isFormValid
//                   ? [
//                       Styles.text_input_style_error,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//                   : [
//                       Styles.text_input_style,
//                       { textAlign: isRTL ? "right" : "left" },
//                     ]
//               }
//             />
//             <TouchableOpacity
//               onPress={() => {
//                 this.setState({ isShowCountryPicker: true });
//               }}
//               style={Styles.countryCode}
//             />
//           </View>

//           <View style={Styles.callingCodeContainer}>
//             <View
//               style={{
//                 width: normalizedWidth(50),
//                 borderBottomWidth: 1,
//                 borderBottomColor:
//                   !country.valid && !isFormValid ? "red" : "#bcbcbc",
//               }}
//             >
//               <Text style={Styles.callingCodeText}>+{callingCode}</Text>
//             </View>
//             <View style={{ paddingHorizontal: 15 }} />
//             <View style={{ flex: 1 }}>
//               <FloatingLabelInput
//                 value={mobile.text}
//                 keyboardType={"phone-pad"}
//                 onChangeText={(text) => {
//                   this.validateInput(text, "mobile");
//                 }}
//                 label={
//                   <Text>
//                     {translate("Mobile Number")}
//                     <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
//                   </Text>
//                 }
//                 ref={(ref) => (this.phoneNoRef = ref)}
//                 maxLength={8}
//                 ismobile={true}
//                 returnKeyType={"next"}
//                 style={
//                   !mobile.valid && !isFormValid
//                     ? [
//                         Styles.text_input_style_error,
//                         { textAlign: isRTL ? "right" : "left" },
//                       ]
//                     : [
//                         Styles.text_input_style,
//                         { textAlign: isRTL ? "right" : "left" },
//                       ]
//                 }
//               />
//             </View>
//           </View>

//           {isFromCheckOutScreen && !isBillingAddress && (
//             <TouchableOpacity
//               style={{ marginHorizontal: 40 }}
//               onPress={() =>
//                 this.setState({
//                   useDifferentAddressForBilling: !useDifferentAddressForBilling,
//                 })
//               }
//             >
//               <View style={Styles.useDifferentAddress}>
//                 <View style={Styles.checkboxImg}>
//                   {useDifferentAddressForBilling && (
//                     <Image
//                       source={Images.tick}
//                       style={{
//                         height: 10,
//                         width: 10,
//                         tintColor: constants.APP_THEME_COLOR,
//                       }}
//                     />
//                   )}
//                 </View>
//                 <Text style={Styles.differentAddress}>
//                   {translate("use different address")}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}

//           <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
//             <BottomButton
//               onButtonClick={() => this.saveAddress()}
//               buttonText={
//                 isEdit
//                   ? translate("UPDATE")
//                   : isFromCheckOutScreen
//                   ? translate("NEXT")
//                   : translate("SAVE ADDRESS")
//               }
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }
// }

// export default GuestAddAddressView;

/**
 * Created by iLeaf Solutions Pvt.Ltd
 * on February 19, 2020
 * AddAddressView - In this screen user can add/edit their address.
 */

import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  FlatList,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Styles from "./style";
import React, { Component } from "react";
import Images from "../../config/images";
import { isEmpty } from "../../config/common";
import Countries from "../../lib/countires.js";
import HudView from "../../components/hudView";
import constants from "../../config/constants";
import Modal from "react-native-modal";
import CountryPicker from "react-native-country-picker-modal";
import { translate } from "../../config/languageSwitching/index";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import {
  showSingleAlert,
  checkPhoneNumberValid,
  normalizedWidth,
} from "../../config/common";
import NavigationHeader1 from "../../components/NavigationHeaders/NavigationHeader1";
import NavigationHeader from "../../components/NavigationHeaders/NavigationHeader1";
import BottomButton from "../../components/BottomButton";
import styles from "../../components/NavigationHeaders/styles";

let countryFromAddress = "";
class GuestAddAddressView extends Component {
  constructor(props) {
    super(props);
    const { details, edit } = props.navigation.state.params;
    const { storeCode } = props;
    let streetAddress = "";

    if (edit)
      details.street.map((item) => {
        streetAddress = streetAddress + item + "\n";
      });

    if (
      props.navigation.state.params.isFromGuestCheckout &&
      details &&
      details.street
    ) {
      details.street.map((item) => {
        streetAddress = streetAddress + item + "\n";
      });
    }

    let countryName = "Kuwait";
    let callingCode = "965";
    let countryCode = "KW";

    if (details.country_id && details.country_id !== "") {
      countryCode = details.country_id;
      countryName = Countries[countryCode].name.common;
      callingCode = Countries[countryCode].callingCode;
    }

    let blockAndStreet = "";
    let avenue = "";
    let buildingAndFloor = "";

    if (details && details.street && details.street.length == 3) {
      blockAndStreet = details.street[0];
      avenue = details.street[1];
      buildingAndFloor = details.street[2];
    }

    this.state = {
      availableCountries: [],
      availableRegions: [],
      countryRegions: [],
      isFormValid: true,
      regionID: "",
      isEdit: edit,
      isShowCountryPicker: false,
      countryName: countryName,
      callingCode: callingCode,
      countryCode: countryCode,
      maxVal: 200,
      textLength: 0,
      useDifferentAddressForBilling: false,
      cityArray: [],
      isShowRegionPicker: false,
      searchText: "",
      searchResult: [],

      formFeilds: {
        firstname: {
          text: details.firstname
            ? details.firstname + " " + details.lastname
            : "" || "",
          valid:
            details.firstname && !isEmpty(details.firstname) ? true : false,
        },
        lastname: {
          text: details.lastname || "",
          valid: details.lastname && !isEmpty(details.lastname) ? true : false,
        },
        region: {
          text:
            details && details.region ? details.region.default_name : "" || "",
          valid:
            details &&
            details.region &&
            details.region.default_name &&
            !isEmpty(details && details.region.default_name)
              ? true
              : false,
          info: details ? details.region : null,
        },
        city: {
          text: details.city || "",
          valid: true,
        },
        address: {
          text: details && details.street ? streetAddress : "",
          valid: true,
          // details && details.street && streetAddress.length > 0
          //   ? true
          //   : false,
        },

        blockAndStreet: {
          text: details && details.street ? blockAndStreet : "",
          valid:
            details && details.street && blockAndStreet.length > 0
              ? true
              : false,
        },
        avenue: {
          text: details && details.street ? avenue : "",
          valid: true, //details && details.street && avenue.length > 0 ? true : false,
        },
        buildingAndFloor: {
          text: details && details.street ? buildingAndFloor : "",
          valid:
            details && details.street && buildingAndFloor.length > 0
              ? true
              : false,
        },

        zipcode: {
          text: "00965",
          valid: true,
        },
        mobile: {
          text: details.telephone || "",
          valid:
            details.telephone && !isEmpty(details.telephone) ? true : false,
        },
        country_state: {
          text: details.country_state || "",
          valid: true,
        },
        country: {
          text: countryFromAddress || "",
          countryID: details.country_id || "",
          valid: countryName !== "",
          // countryFromAddress && !isEmpty(countryFromAddress) ? true : false,
        },
      },
    };
  }

  componentDidMount() {
    this.props.getAvailableRegions((cityArray) => {
      this.setState({ cityArray, searchResult: cityArray });
    });
  }

  componentWillUnmount() {
    countryFromAddress = "";
  }
  didTapOnBackButton = () => {
    this.props.navigation.goBack();
  };

  validateInput = (text, fieldname) => {
    if (fieldname === "firstname") {
      var res = text.split(" ");

      if (res.length > 1) {
        let stateObject = {
          text: text,
          valid: text.length !== 0 && text.trim().length !== 0,
        };

        let stateObject2 = {
          text: text.substr(text.indexOf(" ") + 1),
          valid: text.length !== 0 && text.trim().length !== 0,
        };
        let formfeilds = this.state.formFeilds;
        formfeilds[fieldname] = stateObject;
        formfeilds["lastname"] = stateObject2;
        this.setState({ formFeilds: formfeilds });
      } else {
        let stateObject = {
          text: text,
          valid: text.length !== 0 && text.trim().length !== 0,
        };
        let stateObject2 = {
          text: "address",
          valid: text.length !== 0 && text.trim().length !== 0,
        };
        let formfeilds = this.state.formFeilds;
        formfeilds[fieldname] = stateObject;
        formfeilds["lastname"] = stateObject2;
        this.setState({ formFeilds: formfeilds });
      }

      return;
    }

    let stateObject = {
      text: text,
      valid: text.length !== 0 && text.trim().length !== 0,
    };

    if (fieldname == "avenue") {
      stateObject.valid = true;
    }

    let formfeilds = this.state.formFeilds;
    formfeilds[fieldname] = stateObject;
    this.setState({ formFeilds: formfeilds });
    // if (fieldname === "address") {
    //   this.setState({ textLength: text.length });
    // }
  };

  selectedRegion = (region) => {
    let stateObject = {
      text: region[0].name.toString(),
      id: region[0].id,
      valid: true,
    };

    let formfeilds = this.state.formFeilds;
    formfeilds["country_state"] = stateObject;
    this.setState({ formFeilds: formfeilds, regionID: region[0].id });
  };

  // saveAddress = () => {
  //   console.log("address", this.state.formFeilds);
  //   let isFromGuestCheckout = this.props.navigation.state.params
  //     .isFromGuestCheckout
  //     ? this.props.navigation.state.params.isFromGuestCheckout
  //     : false;

  //   if (isFromGuestCheckout) {
  //     const {
  //       firstname,
  //       lastname,
  //       city,
  //       address,
  //       zipcode,
  //       mobile,
  //       country_state,
  //       country,
  //     } = this.state.formFeilds;

  //     const { countryCode } = this.state;

  //     console.log("address", this.state.formFeilds);

  //     let newAddress = {
  //       region_id: country_state.id || 0,
  //       country_id: countryCode,
  //       street: [address.text],
  //       firstname: firstname.text,
  //       lastname: lastname.text,
  //       company: "",
  //       telephone: mobile.text,
  //       city: city.text,
  //       postcode: zipcode.text,
  //     };
  //     const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
  //       return !this.state.formFeilds[item].valid;
  //     });
  //     this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

  //     if (filledFeilds.length === 0) {
  //       if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
  //         showSingleAlert(translate("Please enter a valid phone number"));
  //         return;
  //       }
  //     }
  //     if (filledFeilds.length === 0) {
  //       this.props.navigation.state.params.addAddressCallback(newAddress);
  //       this.props.navigation.goBack();
  //     } else {
  //       showSingleAlert(translate("Please fill the mandatory fields"));
  //     }
  //   } else {
  //     const { mobile } = this.state.formFeilds;

  //     const { countryCode } = this.state;
  //     const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
  //       return !this.state.formFeilds[item].valid;
  //     });
  //     this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

  //     if (filledFeilds.length === 0) {
  //       if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
  //         showSingleAlert(translate("Please enter a valid phone number"));
  //         return;
  //       }
  //     }

  //     if (filledFeilds.length === 0) {
  //       this.callAddressAction();
  //     } else {
  //       showSingleAlert(translate("Please fill the mandatory fields"));
  //     }
  //   }
  // };

  // callAddressAction = () => {
  //   const { storeCode, storeView, userInfo, addressList } = this.props;
  //   const { isEdit } = this.state;
  //   const { details } = this.props.navigation.state.params;

  //   const isFromCheckOutScreen = this.props.navigation.state.params
  //     .isFromCheckOutScreen;
  //   const isBillingAddress = this.props.navigation.state.params
  //     .isBillingAddress;

  //   let userAddress = [];
  //   // const storeIDArray = storeView.filter((item) => {
  //   //   return item.code === storeCode;
  //   // });
  //   const store_id = 1;
  //   const {
  //     firstname,
  //     lastname,
  //     city,
  //     address,
  //     zipcode,
  //     mobile,
  //     country_state,
  //     country,
  //     region,
  //     blockAndStreet,
  //     avenue,
  //     buildingAndFloor,
  //   } = this.state.formFeilds;
  //   const { countryCode } = this.state;

  //   let textArray = address.text.split("↵");
  //   let textArray2 = address.text.split("\n");

  //   let stringarray = [];
  //   // textArray2.forEach((element) => {
  //   //   if (element.length > 0) {
  //   //     stringarray.push(element.trim());
  //   //   }
  //   // });

  //   // if (stringarray.length > 3) {
  //   //   showSingleAlert(translate("Address cannot contain more than 3 lines"));
  //   //   return;
  //   // }

  //   stringarray.push(blockAndStreet.text);
  //   stringarray.push(avenue.text);
  //   stringarray.push(buildingAndFloor.text);

  //   let firstNameArrary = firstname.text.split(" ");

  //   let newAddress = {
  //     region_id: region.info.region_id || 0,
  //     country_id: countryCode, //country.countryID.trim(),
  //     street: stringarray,
  //     firstname: firstNameArrary[0],
  //     lastname: lastname.text.trim(),
  //     company: "",
  //     telephone: mobile.text.trim(),
  //     city: region.text.trim(),
  //     postcode: zipcode.text.trim(),
  //     default_billing: addressList.length == 0 ? true : false,
  //     default_shipping: addressList.length == 0 ? true : false,
  //   };

  //   if (isFromCheckOutScreen && isBillingAddress) {
  //     newAddress.default_billing = true;
  //   }

  //   if (isEdit) {
  //     let itemIndex;
  //     userAddress = addressList;
  //     userAddress.map((item, i) => {
  //       if (item.id === details.id) itemIndex = i;
  //     });

  //     newAddress["default_billing"] = details["default_billing"];
  //     newAddress["default_shipping"] = details["default_shipping"];
  //     userAddress[itemIndex] = newAddress;
  //   }

  //   const addresses = [...addressList, newAddress];
  //   const editAddresses = userAddress; //[...userAddress]; //[{...newAddress}];
  //   console.log("addresses", addresses);

  //   let request = {
  //     customer: {
  //       email: userInfo.email || "",
  //       firstname: userInfo.firstname || "",
  //       lastname: userInfo.lastname || "",
  //       store_id: store_id,
  //       website_id: 1,
  //       addresses: isEdit ? editAddresses : addresses,
  //     },
  //   };
  //   console.log("addresses", addresses);
  //   if (isEdit) {
  //     this.props.editAddressUser(request, this.editAddressCallback);
  //   } else {
  //     this.props.addAddressUser(request, this.addAddressCallback);
  //   }
  // };

  saveAddress = () => {
    let isFromGuestCheckout = this.props.navigation.state.params
      .isFromGuestCheckout
      ? this.props.navigation.state.params.isFromGuestCheckout
      : false;

    if (isFromGuestCheckout) {
      const {
        firstname,
        lastname,
        city,
        address,
        zipcode,
        mobile,
        country_state,
        country,
        region,
        blockAndStreet,
        avenue,
        buildingAndFloor,
      } = this.state.formFeilds;

      const { countryCode } = this.state;

      stringarray.push(blockAndStreet.text.trim());
      stringarray.push(avenue.text.trim());
      stringarray.push(buildingAndFloor.text.trim());

      let firstNameArrary = firstname.text.trim().split(" ");

      let newAddress = {
        region_id: region.info.region_id || 0,
        country_id: countryCode,
        street: stringarray,
        firstname: firstNameArrary[0].trim(),
        lastname: lastname.text,
        company: "",
        telephone: mobile.text,
        city: region.text.trim(),
        postcode: zipcode.text,
        region: region.info,
      };
      const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
        return !this.state.formFeilds[item].valid;
      });
      this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

      if (filledFeilds.length === 0) {
        if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
          showSingleAlert(translate("Please enter a valid phone number"));
          return;
        }
      }
      if (filledFeilds.length === 0) {
        this.props.navigation.state.params.addAddressCallback(newAddress);
        this.props.navigation.goBack();
      } else {
        showSingleAlert(translate("Please fill the mandatory fields"));
      }
    } else {
      const { mobile } = this.state.formFeilds;

      const { countryCode } = this.state;
      const filledFeilds = Object.keys(this.state.formFeilds).filter((item) => {
        return !this.state.formFeilds[item].valid;
      });
      this.setState({ isFormValid: filledFeilds.length > 0 ? false : true });

      if (filledFeilds.length === 0) {
        if (!checkPhoneNumberValid(mobile.text) || mobile.text.length < 8) {
          showSingleAlert(translate("Please enter a valid phone number"));
          return;
        }
      }

      if (filledFeilds.length === 0) {
        this.callAddressAction();
      } else {
        showSingleAlert(translate("Please fill the mandatory fields"));
      }
    }
  };

  callAddressAction = () => {
    const { guestAddressList } = this.props;
    const { isEdit } = this.state;
    const { details } = this.props.navigation.state.params;

    const isFromCheckOutScreen = this.props.navigation.state.params
      .isFromCheckOutScreen;
    const isBillingAddress = this.props.navigation.state.params
      .isBillingAddress;

    let userAddress = [];

    const store_id = 1;
    const {
      firstname,
      lastname,
      city,
      address,
      zipcode,
      mobile,
      country_state,
      country,
      region,
      blockAndStreet,
      avenue,
      buildingAndFloor,
    } = this.state.formFeilds;
    const { countryCode } = this.state;

    let textArray = address.text.split("↵");
    let textArray2 = address.text.split("\n");

    let stringarray = [];
    // textArray2.forEach((element) => {
    //   if (element.length > 0) {
    //     stringarray.push(element.trim());
    //   }
    // });

    // if (stringarray.length > 3) {
    //   showSingleAlert(translate("Address cannot contain more than 3 lines"));
    //   return;
    // }

    stringarray.push(blockAndStreet.text.trim());
    stringarray.push(avenue.text.trim());
    stringarray.push(buildingAndFloor.text.trim());

    let firstNameArrary = firstname.text.trim().split(" ");

    let newAddress = {
      region_id: region.info.region_id || 0,
      country_id: countryCode, //country.countryID.trim(),
      street: stringarray,
      firstname: firstNameArrary[0].trim(),
      lastname: lastname.text.trim() === "" ? "address" : lastname.text.trim(),
      company: "",
      telephone: mobile.text.trim(),
      city: region.text.trim(),
      postcode: zipcode.text.trim(),
      default_billing: true,
      default_shipping: true,
      id: isBillingAddress ? 2 : 1,
      region: region.info,
    };

    let addresses = [];

    if (!isEdit) {
      if (isFromCheckOutScreen && isBillingAddress) {
        newAddress.default_billing = true;
        let shippingAddress = guestAddressList[0];
        shippingAddress.default_billing = false;
        newAddress.default_shipping = false;
        addresses.push(newAddress);
        addresses.push(shippingAddress);
      } else {
        newAddress.default_billing = false;
        addresses.push(newAddress);

        let newAddress2 = {
          region_id: region.info.region_id || 0,
          country_id: countryCode, //country.countryID.trim(),
          street: stringarray,
          firstname: firstNameArrary[0],
          lastname:
            lastname.text.trim() === "" ? "address" : lastname.text.trim(),
          company: "",
          telephone: mobile.text.trim(),
          city: region.text.trim(),
          postcode: zipcode.text.trim(),
          default_billing: true,
          default_shipping: false,
          id: 2,
          region: region.info,
        };
        addresses.push(newAddress2);
      }
    }

    if (isEdit) {
      let itemIndex;
      newAddress["id"] = details.id;
      userAddress = guestAddressList;
      userAddress.map((item, i) => {
        if (item.id === details.id) itemIndex = i;
      });

      newAddress["default_billing"] = details["default_billing"];
      newAddress["default_shipping"] = details["default_shipping"];
      userAddress[itemIndex] = newAddress;
    }

    const editAddresses = userAddress;

    let request = isEdit ? editAddresses : addresses;

    if (isEdit) {
      this.props.editAddressUser(request);
      this.editAddressCallback(true);
    } else {
      this.props.addAddressUser(request);
      this.addAddressCallback(true);
    }
  };

  editAddressCallback = (status) => {
    if (status) {
      showSingleAlert(
        translate("Successfully_Updated"),
        translate("Ok"),
        () => {
          const guestAddressUpdateCallback = this.props.navigation.state.params
            .guestAddressUpdateCallback;
          guestAddressUpdateCallback();
          this.props.navigation.goBack();
        }
      );
    }
  };

  // addAddressCallback = (status) => {
  //   if (status) {
  //     showSingleAlert("Successfully Added", "OK", () => {
  //       const isFromCheckOutScreen = this.props.navigation.state.params
  //         .isFromCheckOutScreen;
  //       const totalCost = this.props.navigation.state.params.totalCost;
  //       const isBillingAddress = this.props.navigation.state.params
  //         .isBillingAddress;

  //       if (isFromCheckOutScreen) {
  //         if (this.state.useDifferentAddressForBilling) {
  //           this.props.navigation.push("AddAddressScreen", {
  //             details: {},
  //             isBillingAddress: true,
  //             totalCost: totalCost,
  //             isFromCheckOutScreen: true,
  //           });
  //         } else {
  //           this.props.navigation.navigate("Checkout", {
  //             totalCost,
  //             isFromAddAddress: true,
  //             isFromProductDetail: true,
  //           });
  //         }
  //       } else {
  //         this.props.navigation.goBack();
  //       }
  //     });
  //   }
  // };

  addAddressCallback = (status) => {
    if (status) {
      showSingleAlert(translate("Successfully_Added"), translate("Ok"), () => {
        const isFromCheckOutScreen = this.props.navigation.state.params
          .isFromCheckOutScreen;

        const isFromProductsDetailScreen = this.props.navigation.state.params
          .isFromProductsDetailScreen;
        const totalCost = this.props.navigation.state.params.totalCost;

        if (isFromCheckOutScreen) {
          if (this.state.useDifferentAddressForBilling) {
            this.props.navigation.push("GuestAddAddress", {
              details: {},
              isBillingAddress: true,
              totalCost: totalCost,
              isFromCheckOutScreen: true,
              isFromProductsDetailScreen,
            });
          } else {
            this.props.navigation.navigate("Checkout", {
              totalCost,
              isFromAddAddress: true,
              isFromProductDetail: true,
              isFromProductsDetailScreen,
            });
          }
        } else {
          this.props.navigation.goBack();
        }
      });
    }
  };

  _renderRegion = ({ item, index }) => {
    const { region } = this.state.formFeilds;
    const { cityArray } = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            isShowRegionPicker: false,
            searchResult: cityArray,
          });

          let stateObject = {
            text: item.default_name,
            valid: true,
            info: item,
          };
          let formfeilds = this.state.formFeilds;
          formfeilds["region"] = stateObject;
          this.setState({ formFeilds: formfeilds });
        }}
        style={Styles.cityItemContainer}
      >
        <Text style={Styles.cityName}>{item.default_name}</Text>
        {region.text === item.default_name && (
          <Image source={Images.tick} style={Styles.tick} />
        )}
      </TouchableOpacity>
    );
  };

  _searchFilterFunction = (text) => {
    const { cityArray, searchResult } = this.state;

    const newData = cityArray.filter((item) => {
      const itemData = `${item.default_name.toUpperCase()}`;
      // ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ searchResult: newData });
  };

  render() {
    const {
      firstname,
      lastname,
      city,
      address,
      zipcode,
      mobile,
      country_state,
      country,
      region,
      blockAndStreet,
      buildingAndFloor,
      avenue,
    } = this.state.formFeilds;

    const {
      isShowCountryPicker,
      countryName,
      callingCode,
      isShowRegionPicker,
      cityArray,
      searchResult,
    } = this.state;
    const { isRTL } = this.props;
    const {
      isFormValid,
      countryRegions,
      isEdit,
      availableRegions,
      useDifferentAddressForBilling,
    } = this.state;

    const isFromCheckOutScreen = this.props.navigation.state.params
      .isFromCheckOutScreen;

    const isBillingAddress = this.props.navigation.state.params
      .isBillingAddress;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <NavigationHeader1
          hideSearch={true}
          title={
            isEdit
              ? translate("Edit Address")
              : isBillingAddress
              ? translate("Add Billing Address")
              : translate("Add Address")
          }
          showBackButton={true}
          didTapOnLeftButton={this.didTapOnBackButton}
          isRTL={isRTL}
        />
        {/* <Text style={Styles.titleStyle}>{isEdit ? translate("Edit Address") : translate("Add Address")}</Text> */}
        <ScrollView>
          <View style={{ paddingHorizontal: 40, paddingVertical: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Address Name")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              value={firstname.text}
              onChangeText={(text) => {
                this.validateInput(text, "firstname");
              }}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => {}}
              style={
                !firstname.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View>
          <View
            style={{
              paddingHorizontal: 40,
              paddingBottom: 35,
            }}
          >
            <FloatingLabelInput
              value={region.text}
              onChangeText={(text) => {
                this.validateInput(text, "region");
              }}
              onFocus={() => {
                Keyboard.dismiss();
                this.setState({ isShowRegionPicker: true });
              }}
              label={
                <Text>
                  {translate("Area")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              ref={(ref) => (this.cityRef = ref)}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => {}}
              style={
                !region.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
            <TouchableOpacity
              onPress={() => this.setState({ isShowRegionPicker: true })}
              style={{
                backgroundColor: constants.APP_TRANSPARENT_COLOR,
                position: "absolute",
                top: -10,
                bottom: 0,
                right: 0,
                left: 0,
                marginBottom: 30,
              }}
            />
          </View>

          {/* <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Last Name")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              value={lastname.text}
              onChangeText={(text) => {
                this.validateInput(text, "lastname");
              }}
              // placeholder={translate("Last Name")}
              ref={(ref) => (this.lastNameRef = ref)}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => this.addressRef.focus()}
              style={
                !lastname.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View> */}

          <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Block & Street Name/No")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              value={blockAndStreet.text}
              onChangeText={(text) => {
                this.validateInput(text, "blockAndStreet");
              }}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => {}}
              style={
                !blockAndStreet.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View>
          <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Avenue")}
                  {/* <Text style={{ color: constants.APP_RED_COLOR }}>*</Text> */}
                </Text>
              }
              value={avenue.text}
              onChangeText={(text) => {
                this.validateInput(text, "avenue");
              }}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => {}}
              style={
                !avenue.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View>
          <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              label={
                <Text>
                  {translate("Building and Floor No")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              value={buildingAndFloor.text}
              onChangeText={(text) => {
                this.validateInput(text, "buildingAndFloor");
              }}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => {}}
              style={
                !buildingAndFloor.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View>

          {/* <View style={{ paddingHorizontal: 40 }}>
            <FloatingLabelInput
              value={address.text}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => {
                this.validateInput(text, "address");
              }}
              label={
                <Text>
                  {translate("Address")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              ref={(ref) => (this.addressRef = ref)}
              maxLength={200}
              returnKeyType={"next"}
              style={
                !address.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
            <Text style={Styles.lettermax}>
              {this.state.maxVal - this.state.textLength}{" "}
              {translate("letters maximum")}
            </Text>
          </View> */}

          {/* <View
            style={{
              paddingHorizontal: 40,
              paddingBottom: 35,
            }}
          >
            <FloatingLabelInput
              value={city.text}
              onChangeText={(text) => {
                this.validateInput(text, "city");
              }}
              onFocus={() => {
                Keyboard.dismiss();
                this.setState({ isShowRegionPicker: true });
              }}
              label={
                <Text>
                  {translate("City/Emirate")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              ref={(ref) => (this.cityRef = ref)}
              maxLength={30}
              returnKeyType={"next"}
              onSubmitEditing={() => this.zipCodeRef.focus()}
              style={
                !city.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
            <TouchableOpacity
              onPress={() => this.setState({ isShowRegionPicker: true })}
              style={{
                backgroundColor: constants.APP_TRANSPARENT_COLOR,
                position: "absolute",
                top: -10,
                bottom: 0,
                right: 0,
                left: 0,
                marginBottom: 30,
              }}
            />
          </View> */}

          {/* <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              value={zipcode.text}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                this.validateInput(text, "zipcode");
              }}
              label={
                <Text>
                  {translate("Zip")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              ref={(ref) => (this.zipCodeRef = ref)}
              maxLength={10}
              returnKeyType={"next"}
              style={
                !zipcode.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
          </View> */}

          {/* <View style={{ paddingHorizontal: 40, paddingBottom: 35 }}>
            <FloatingLabelInput
              disabled
              value={countryName}
              // onChangeText={(text) => {
              // 	this.validateInput(text, "city");
              // }}
              label={
                <Text>
                  {translate("Country")}
                  <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                </Text>
              }
              // ref={(ref) => (this.cityRef = ref)}
              maxLength={30}
              returnKeyType={"next"}
              // onSubmitEditing={() => this.zipCodeRef.focus()}
              style={
                !country.valid && !isFormValid
                  ? [
                      Styles.text_input_style_error,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
                  : [
                      Styles.text_input_style,
                      { textAlign: isRTL ? "right" : "left" },
                    ]
              }
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ isShowCountryPicker: true });
              }}
              style={Styles.countryCode}
            />
          </View> */}

          {isRTL ? (
            <View style={Styles.callingCodeContainer}>
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  value={mobile.text}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) => {
                    this.validateInput(text, "mobile");
                  }}
                  label={
                    <Text>
                      {translate("Mobile Number")}
                      <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  ref={(ref) => (this.phoneNoRef = ref)}
                  maxLength={8}
                  // ismobile={true}
                  returnKeyType={"next"}
                  style={
                    !mobile.valid && !isFormValid
                      ? [
                          Styles.text_input_style_error,
                          // { textAlign: isRTL ? "right" : "left" },
                        ]
                      : [
                          Styles.text_input_style,
                          // { textAlign: isRTL ? "right" : "left" },
                        ]
                  }
                />
              </View>
              <View style={{ paddingHorizontal: 15 }} />
              <View
                style={{
                  width: normalizedWidth(50),
                  borderBottomWidth: 1,
                  borderBottomColor:
                    !country.valid && !isFormValid ? "red" : "#bcbcbc",
                }}
              >
                <Text style={Styles.callingCodeText}>+{callingCode}</Text>
              </View>
            </View>
          ) : (
            <View style={Styles.callingCodeContainer}>
              <View
                style={{
                  width: normalizedWidth(50),
                  borderBottomWidth: 1,
                  borderBottomColor:
                    !country.valid && !isFormValid ? "red" : "#bcbcbc",
                }}
              >
                <Text style={Styles.callingCodeText}>+{callingCode}</Text>
              </View>
              <View style={{ paddingHorizontal: 15 }} />
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  value={mobile.text}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) => {
                    this.validateInput(text, "mobile");
                  }}
                  label={
                    <Text>
                      {translate("Mobile Number")}
                      <Text style={{ color: constants.APP_RED_COLOR }}>*</Text>
                    </Text>
                  }
                  ref={(ref) => (this.phoneNoRef = ref)}
                  maxLength={8}
                  ismobile={true}
                  returnKeyType={"next"}
                  style={
                    !mobile.valid && !isFormValid
                      ? [
                          Styles.text_input_style_error,
                          { textAlign: isRTL ? "right" : "left" },
                        ]
                      : [
                          Styles.text_input_style,
                          { textAlign: isRTL ? "right" : "left" },
                        ]
                  }
                />
              </View>
            </View>
          )}

          {isFromCheckOutScreen && !isBillingAddress && (
            <TouchableOpacity
              style={{ marginHorizontal: 40 }}
              onPress={() =>
                this.setState({
                  useDifferentAddressForBilling: !useDifferentAddressForBilling,
                })
              }
            >
              <View style={Styles.useDifferentAddress}>
                <View style={Styles.checkboxImg}>
                  {useDifferentAddressForBilling && (
                    <Image
                      source={Images.tick}
                      style={{
                        height: 10,
                        width: 10,
                        tintColor: constants.APP_THEME_COLOR,
                      }}
                    />
                  )}
                </View>
                <Text style={Styles.differentAddress}>
                  {translate("use different address")}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
            <BottomButton
              onButtonClick={() => this.saveAddress()}
              buttonText={
                isEdit
                  ? translate("UPDATE")
                  : isFromCheckOutScreen
                  ? translate("NEXT")
                  : translate("SAVE ADDRESS")
              }
            />
          </View>
        </ScrollView>

        <Modal
          isVisible={isShowRegionPicker}
          onBackdropPress={() => {
            this.setState({ isShowRegionPicker: false });
          }}
          onBackButtonPress={() => {
            this.setState({ isShowRegionPicker: false });
          }}
          style={{ margin: 0 }}
        >
          <SafeAreaView
            style={{
              margin: 0,
              flex: 1,
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            <NavigationHeader
              isWishlist={false}
              hideSearch={true}
              title={translate("Select your region")}
              showBackButton={true}
              didTapOnLeftButton={() => {
                this.setState({
                  isShowRegionPicker: false,
                });
              }}
              isRTL={this.props.isRTL}
            />
            <View
              style={{
                height: 40,
                borderBottomColor: constants.APP_SEPARATOR_COLOR,
                borderBottomWidth: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{ marginHorizontal: 10 }}
                source={Images.searchNew}
              />
              <TextInput
                style={{ height: 40, flex: 1 }}
                placeholder={translate("Search")}
                clearButtonMode
                onChangeText={this._searchFilterFunction}
              />
            </View>
            <FlatList
              extraData={this.state}
              renderItem={this._renderRegion}
              data={searchResult}
              keyboardShouldPersistTaps={"handled"}
              ListEmptyComponent={() => {
                return (
                  <Text
                    style={{
                      marginVertical: 20,
                      textAlign: "center",
                      color: constants.APP_GRAY_COLOR,
                    }}
                  >
                    {"No search result"}
                  </Text>
                );
              }}
            />
          </SafeAreaView>
        </Modal>
        {/* <CountryPicker
          {...{
            withFilter: true,
            withCountryNameButton: true,
            withAlphaFilter: true,
            onSelect: (data) => {
              console.log(("SELECTED COUNTRY DATA", data));
              this.setState({
                countryName: data.name,
                countryCode: data.cca2,
                callingCode: data.callingCode,
              });
              this.validateInput(data.name, "country");
            },
            placeholder: "",
            onClose: () => {
              this.setState({ isShowCountryPicker: false });
            },
          }}
          style={{ width: 0, height: 0 }}
          visible={isShowCountryPicker}
        /> */}
        {this.props.isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}

export default GuestAddAddressView;
