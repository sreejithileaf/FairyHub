/**
 * Created by Kareem for iLeaf Solutions Pvt.Ltd
 * on July 07, 2020
 * FilterScreen - Screen.
 */
import {
  Text,
  View,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  LayoutAnimation,
} from 'react-native';
import styles from './style';
import HudView from '../../components/hudView';
import React, {Component} from 'react';
import images from '../../config/images';
import constants from '../../config/constants';
import {translate} from '../../config/languageSwitching';
import NavigationHeader3 from '../../components/NavigationHeaders/NavigationHeader3';

// Gender Card component
const GenderCard = React.memo(({item, selected, selectGender}) => {
  let selectedBackground = constants.APP_THEME_COLOR;
  if (selected === item.value && item.value == '5510') {
    selectedBackground = constants.APP_THEME_COLOR;
  } else if (selected === item.value && item.value == '5508') {
    selectedBackground = constants.APP_COLOR_BOY;
  } else if (selected === item.value && item.value == '5509') {
    selectedBackground = constants.APP_COLOR_GIRL;
  } else {
    selectedBackground = constants.APP_GRAY_COLOR2;
  }

  let genderImage;
  switch (item.value) {
    case '5510':
      genderImage = images.uniSex_11_13;
      break;
    case '5508':
      genderImage = images.boy_11_13;
      break;
    case '5509':
      genderImage = images.girl_11_13;
      break;
  }

  return (
    <View key={item.value} style={styles.genderContainer}>
      <TouchableOpacity
        activeOpacity={constants.ACTIVE_OPACITY}
        onPress={() => selectGender(item.value)}
        style={[
          styles.genderContainer2,
          {
            backgroundColor: selectedBackground,
          },
        ]}>
        <Image source={genderImage} style={styles.genderIcons} />
      </TouchableOpacity>
      <Text style={styles.listText}>{item.display}</Text>
    </View>
  );
});

//Checkbox Item component
const Checkbox = React.memo(({item, selected, onSelect}) => (
  <TouchableOpacity
    activeOpacity={constants.activeOpacity}
    style={styles.checkBoxWrap}
    onPress={() => onSelect()}>
    <Image
      source={images.ckeckbox_dot}
      style={selected ? styles.checkBoxIconSelected : styles.checkBoxIcon}
    />
    <Text style={selected ? styles.checkTextActive : styles.checkText}>
      {item.display}
    </Text>
  </TouchableOpacity>
));

//Sort Item component
const SortItem = React.memo(({item, selected, onSelect}) => (
  <TouchableOpacity
    activeOpacity={constants.activeOpacity}
    style={[
      styles.checkBoxWrap,
      {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: constants.APP_SEPARATOR_COLOR,
      },
    ]}
    onPress={() => onSelect()}>
    <Text
      style={[
        selected ? styles.checkTextActive : styles.checkText,
        {flex: 1, textAlign: 'left'},
      ]}>
      {translate(item.title)}
    </Text>
    {selected && (
      <Image
        source={images.whiteTick}
        style={[styles.checkBoxIcon, {tintColor: constants.APP_THEME_COLOR}]}
      />
    )}
  </TouchableOpacity>
));

export default class FilterScreen extends Component {
  constructor(props) {
    super(props);

    let filterParams = props.navigation.state.params.filterParams;

    let filter_attributes = filterParams && filterParams.filter_attributes;

    let selectedGender = '0';
    let selectedSortIndex = -1;
    let priceFrom = '';
    let priceTo = '';
    let discount = false;
    let isBalloonsSelected = false;
    let isGiftwrapSelected = false;
    let sameDayDelivery = false;
    let isFreeDeliverySelected = false;
    let isDeliveryOnAppointmentSelected = false;
    let ageSelected = [];
    let brandSelected = [];
    let characterSelected = [];
    let categorySelected = [];
    let themeSelected = [];

    if (filter_attributes) {
      if (filter_attributes.price_from) {
        priceFrom = filter_attributes.price_from;
      }
      if (filter_attributes.price_to) {
        priceTo = filter_attributes.price_to;
      }
      if (filter_attributes.is_discountable) {
        discount = true;
      }
      if (filter_attributes.available_balloons) {
        isBalloonsSelected = true;
      }
      if (filter_attributes.available_giftwrap) {
        isGiftwrapSelected = true;
      }
      if (filter_attributes.delivery_type) {
        sameDayDelivery = true;
      }
      if (filter_attributes.free_delivery) {
        isFreeDeliverySelected = true;
      }
      if (filter_attributes.delivery_appointment) {
        isDeliveryOnAppointmentSelected = true;
      }
      if (filter_attributes.gender) {
        selectedGender = filter_attributes.gender[0];
      }
      if (filter_attributes.age) {
        ageSelected = filter_attributes.age;
      }
      if (filter_attributes.age_range) {
        ageSelected = filter_attributes.age_range;
      }
      if (filter_attributes.brand) {
        brandSelected = filter_attributes.brand;
      }
      if (filter_attributes.character) {
        characterSelected = filter_attributes.character;
      }
      if (filter_attributes.cat) {
        categorySelected = filter_attributes.cat;
      }
      if (filter_attributes.theme) {
        themeSelected = filter_attributes.theme;
      }
    }

    if (filterParams.sort_field && filterParams.sort_orer) {
      let sort_field = filterParams.sort_field;
      let sort_orer = filterParams.sort_orer;
      if (sort_field === 'created_at' && sort_orer === 'desc') {
        selectedSortIndex = 0;
      } else if (sort_field === 'most_popular_count' && sort_orer === 'asc') {
        selectedSortIndex = 1;
      } else if (sort_field === 'price' && sort_orer === 'asc') {
        selectedSortIndex = 2;
      } else if (sort_field === 'price' && sort_orer === 'desc') {
        selectedSortIndex = 3;
      }
    }

    this.state = {
      selectedGender: selectedGender,
      brandSelected: brandSelected,
      ageSelected: ageSelected,
      categorySelected: categorySelected,
      characterSelected: characterSelected,
      themeSelected: themeSelected,
      discount: discount,
      sameDayDelivery: sameDayDelivery,
      selectedSortIndex: selectedSortIndex,
      isShowAdvanceFilter: true,
      isBalloonsSelected: isBalloonsSelected,
      isGiftwrapSelected: isGiftwrapSelected,
      isFreeDeliverySelected: isFreeDeliverySelected,
      isDeliveryOnAppointmentSelected: isDeliveryOnAppointmentSelected,
      priceFrom: priceFrom,
      priceTo: priceTo,
    };

    if (constants.IS_ANDROID === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  //Gender Selection Function
  _selectGender = id => this.setState({selectedGender: id});

  //Brand Select Function
  _onBrandSelect = id => {
    let brandSelected = this.state.brandSelected;
    if (brandSelected.find(brandId => brandId === id)) {
      let filtered = brandSelected.filter(item => item !== id);
      this.setState({
        brandSelected: filtered,
      });
    } else {
      brandSelected.push(id);
      this.setState({
        brandSelected: brandSelected,
      });
    }
  };

  //Category select
  _onCategorySelect = id => {
    let categorySelected = this.state.categorySelected;
    if (categorySelected.find(brandId => brandId === id)) {
      let filtered = categorySelected.filter(item => item !== id);
      this.setState({
        categorySelected: filtered,
      });
    } else {
      categorySelected.push(id);
      this.setState({
        categorySelected: categorySelected,
      });
    }
  };

  //Theme select
  _onThemeSelect = id => {
    let themeSelected = this.state.themeSelected;
    if (themeSelected.find(brandId => brandId === id)) {
      let filtered = themeSelected.filter(item => item !== id);
      this.setState({
        themeSelected: filtered,
      });
    } else {
      themeSelected.push(id);
      this.setState({
        themeSelected: themeSelected,
      });
    }
  };

  //Age Select Function
  _onAgeSelect = id => {
    let ageSelected = this.state.ageSelected;
    if (ageSelected.find(brandId => brandId === id)) {
      let filtered = ageSelected.filter(item => item !== id);
      this.setState({
        ageSelected: filtered,
      });
    } else {
      ageSelected.push(id);
      this.setState({
        ageSelected: ageSelected,
      });
    }
  };

  _onFilterSelect = index => {
    if (this.state.selectedSortIndex === index) {
      this.setState({selectedSortIndex: -1});
      return;
    }
    this.setState({selectedSortIndex: index});
  };

  //Character selection Function
  _onCharacterSelect = id => {
    let characterSelected = this.state.characterSelected;
    if (characterSelected.find(brandId => brandId === id)) {
      let filtered = characterSelected.filter(item => item !== id);
      this.setState({
        characterSelected: filtered,
      });
    } else {
      characterSelected.push(id);
      this.setState({
        characterSelected: characterSelected,
      });
    }
  };

  //Reset Function
  _handleReset = () => {
    this.setState({
      selectedGender: '0',
      selectedSortIndex: -1,
      brandSelected: [],
      ageSelected: [],
      characterSelected: [],
      categorySelected: [],
      themeSelected: [],
      discount: false,
      sameDayDelivery: false,
      isGiftwrapSelected: false,
      isBalloonsSelected: false,
      isFreeDeliverySelected: false,
      isDeliveryOnAppointmentSelected: false,
      priceFrom: '',
      priceTo: '',
    });
  };

  _didTapOnAdvanceFilter = (exp, index) => {
    const {isShowAdvanceFilter} = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({isShowAdvanceFilter: !isShowAdvanceFilter});
  };

  _renderFilterOptions = ({item, index}) => {
    const {selectedGender, selectedSortIndex, brandSelected, ageSelected} =
      this.state;

    // if (item.key === "gender") {
    //   return (
    //     <View key={item.key} style={styles.wrapper}>
    //       <Text style={styles.titleStyle}>{translate("GENDER")}</Text>
    //       <FlatList
    //         horizontal={true}
    //         data={item.keys}
    //         renderItem={({ item }) => (
    //           <GenderCard
    //             item={item}
    //             selected={selectedGender}
    //             selectGender={this._selectGender}
    //           />
    //         )}
    //         keyExtractor={(item) => item.id + Math.random()}
    //       />
    //     </View>
    //   );
    // } else
    if (item.key === 'sortOrder') {
      return (
        <View
          key={item.key}
          style={[
            styles.brandWrapper,
            {borderBottomWidth: 0, paddingBottom: 10},
          ]}>
          <Text style={styles.titleStyle}>{translate('SORT')}</Text>
          <FlatList
            listKey={'SORT_ITEMS'}
            data={item.keys}
            renderItem={({item, index}) => (
              <SortItem
                item={item}
                onSelect={() => this._onFilterSelect(index)}
                selected={selectedSortIndex == index}
              />
            )}
            keyExtractor={item => item.id + Math.random()}
          />
        </View>
      );
    } else if (item.key === 'age') {
      return (
        <View key={item.key} style={styles.brandWrapper}>
          <Text style={styles.titleStyle}>{translate('Age')}</Text>
          <FlatList
            listKey={item.key}
            numColumns={2}
            data={item.keys}
            renderItem={({item}) => (
              <Checkbox
                item={item}
                onSelect={() => this._onAgeSelect(item.value)}
                selected={ageSelected?.find(res => res === item.value)}
              />
            )}
            keyExtractor={item => item.id + Math.random()}
          />
        </View>
      );
    }
  };

  _renderAdvanceFilterOptions = ({item, index}) => {
    const {brandSelected, categorySelected, characterSelected, themeSelected} =
      this.state;

    if (item.key === 'brands') {
      return (
        <View key={item.key} style={styles.brandWrapper}>
          <Text style={styles.titleStyle}>{translate('BRANDS')}</Text>
          <FlatList
            listKey={item.key}
            numColumns={2}
            data={item.keys.slice(0, 20)}
            renderItem={({item}) => (
              <Checkbox
                item={item}
                onSelect={() => this._onBrandSelect(item.value)}
                selected={brandSelected?.find(res => res === item.value)}
              />
            )}
            keyExtractor={item => item.id + Math.random()}
          />
        </View>
      );
    } else if (item.key === 'characters') {
      return (
        <View key={item.key} style={styles.brandWrapper}>
          <Text style={styles.titleStyle}>{translate('CHARACTERS')}</Text>
          <FlatList
            listKey={item.key}
            numColumns={2}
            data={item.keys}
            renderItem={({item}) => (
              <Checkbox
                item={item}
                onSelect={() => this._onCharacterSelect(item.value)}
                selected={characterSelected?.find(res => res === item.value)}
              />
            )}
            keyExtractor={item => item.id + Math.random()}
          />
        </View>
      );
    } else if (item.key === 'theme') {
      return (
        <View key={item.key} style={styles.brandWrapper}>
          <Text style={styles.titleStyle}>{translate('Themes')}</Text>
          <FlatList
            listKey={item.key}
            numColumns={2}
            data={item.keys}
            renderItem={({item}) => (
              <Checkbox
                item={item}
                onSelect={() => this._onThemeSelect(item.value)}
                selected={themeSelected?.find(res => res === item.value)}
              />
            )}
            keyExtractor={item => item.id + Math.random()}
          />
        </View>
      );
    }
    // else if (item.key === "category") {
    //   return (
    //     <View key={item.key} style={styles.brandWrapper}>
    //       <Text style={styles.titleStyle}>{translate("Categories")}</Text>
    //       <FlatList
    //         listKey={item.key}
    //         numColumns={2}
    //         data={item.keys}
    //         renderItem={({ item }) => (
    //           <Checkbox
    //             item={item}
    //             onSelect={() => this._onCategorySelect(item.value)}
    //             selected={categorySelected?.find((res) => res === item.value)}
    //           />
    //         )}
    //         keyExtractor={(item) => item.id + Math.random()}
    //       />
    //     </View>
    //   );
    // }
  };

  _didTapOnFilter = () => {
    const {
      selectedGender,
      selectedSortIndex,
      ageSelected,
      priceFrom,
      priceTo,
      discount,
      isBalloonsSelected,
      isGiftwrapSelected,
      isFreeDeliverySelected,
      isDeliveryOnAppointmentSelected,
      characterSelected,
      categorySelected,
      themeSelected,
      brandSelected,
      sameDayDelivery,
    } = this.state;

    let filterDict = {};
    let filterParams = {};

    if (selectedGender != 0) {
      if (selectedGender === '5510') {
        filterDict['gender'] = [selectedGender];
      } else {
        filterDict['gender'] = [selectedGender, '5510'];
      }
    }

    if (selectedSortIndex > -1) {
      switch (selectedSortIndex) {
        case 0:
          filterParams['sort_field'] = 'created_at';
          filterParams['sort_orer'] = 'desc';
          break;
        case 1:
          filterParams['sort_field'] = 'most_popular_count';
          filterParams['sort_orer'] = 'asc';
          break;
        case 2:
          filterParams['sort_field'] = 'price';
          filterParams['sort_orer'] = 'asc';
          break;
        case 3:
          filterParams['sort_field'] = 'price';
          filterParams['sort_orer'] = 'desc';
          break;
      }
    }

    if (ageSelected.length > 0) {
      filterDict['age_range'] = ageSelected;
    }

    if (characterSelected.length > 0) {
      filterDict['character'] = characterSelected;
    }

    if (categorySelected.length > 0) {
      filterDict['cat'] = categorySelected;
    }

    if (themeSelected.length > 0) {
      filterDict['theme'] = themeSelected;
    }

    if (brandSelected.length > 0) {
      filterDict['brand'] = brandSelected;
    }

    if (priceFrom !== '') {
      filterDict['price_from'] = priceFrom;
    }

    if (priceTo !== '') {
      filterDict['price_to'] = priceTo;
    }

    if (discount) {
      filterDict['is_discountable'] = [5595];
    }

    if (isBalloonsSelected) {
      filterDict['available_balloons'] = [5579];
    }

    if (isGiftwrapSelected) {
      filterDict['available_giftwrap'] = [5581];
    }

    if (isFreeDeliverySelected) {
      filterDict['free_delivery'] = [5591];
    }

    if (isDeliveryOnAppointmentSelected) {
      filterDict['delivery_appointment'] = [5589];
    }

    if (sameDayDelivery) {
      filterDict['delivery_type'] = [5576];
    }

    // let filterParams = {
    // filter_attributes: {
    // price_from: "5",
    // price_to: "9",
    // age: [5562, 5570],
    // gender: [5508, 5509, 5510], //boy,girl,unisex
    // theme: [5511, 5512, 5514],
    // character: [5516, 5518, 5523, 5525, 5526, 5530],
    // brand: [5437, 5438, 5439],
    // available_balloons: [5579], // yes, no
    // available_giftwrap:[5581,5582], // yes, no
    // cat: [4, 25, 45],
    // is_discountable: [5595, 5596], // yes, no
    // free_delivery: [5591, 5592], // yes, no
    // color: [5584,5594,5604],
    // delivery_appointment:[5589,5590] // yes, no
    //   },
    // };

    filterParams['page'] = 1;
    filterParams['page_size'] = constants.PRODUCTS_PAGE_COUNT;

    if (Object.keys(filterDict).length > 0) {
      filterParams['filter_attributes'] = filterDict;
    }

    this.props.navigation.state.params.didTapOnApplyFilter(filterParams);
    this.props.navigation.pop();
  };

  render() {
    const {currency, isRTL, navigation, filterArray, isLoading} = this.props;
    const {
      selectedGender,
      brandSelected,
      characterSelected,
      discount,
      sameDayDelivery,
      selectedSortIndex,
      isShowAdvanceFilter,
      isBalloonsSelected,
      isGiftwrapSelected,
      isFreeDeliverySelected,
      isDeliveryOnAppointmentSelected,
      priceFrom,
      priceTo,
    } = this.state;

    let balloonsArray = filterArray.filter(item => item.key === 'balloons');
    let giftwrapArray = filterArray.filter(item => item.key === 'giftwrap');
    let discountArray = filterArray.filter(item => item.key === 'discount');
    let freeDeliveryArray = filterArray.filter(
      item => item.key === 'freeDelivery',
    );
    let deliveryOnAppointmnetArray = filterArray.filter(
      item => item.key === 'deliveryAppointmnet',
    );
    let sameDayDeliveryArray = filterArray.filter(
      item => item.key === 'sameDayDelivery',
    );

    let isBalloonsAvailable = balloonsArray.length > 0;
    let isGiftwrapAvailable = giftwrapArray.length > 0;
    let isDidcountAvailable = discountArray.length > 0;
    let isFreeDeliveryAvailable = freeDeliveryArray.length > 0;
    let isDeliveryOnAppointmentAvailable =
      deliveryOnAppointmnetArray.length > 0;
    let isSameDayDeliveryAvailable = sameDayDeliveryArray.length > 0;

    let isAdvanceFilterAvailable = filterArray.filter(item => {
      return (
        item.key === 'brands' ||
        item.key === 'characters' ||
        item.key === 'theme' ||
        item.key === 'category'
      );
    });

    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: constants.APP_WHITE_COLOR}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={constants.APP_WHITE_COLOR}
          translucent={false}
        />
        <NavigationHeader3
          isDark={false}
          isRTL={isRTL}
          navigation={navigation}
          handleReset={this._handleReset}
        />

        <FlatList
          data={[1]}
          style={styles.scrollView}
          renderItem={() => {
            return (
              <View>
                <FlatList
                  listKey={'FILTER_OPTIONS'}
                  data={filterArray}
                  renderItem={this._renderFilterOptions}
                  keyExtractor={item => item.id + Math.random()}
                />

                <View style={styles.priceWrapper}>
                  <Text style={styles.titleStyle}>
                    {translate('PRICE RANGE')}
                  </Text>
                  <View style={styles.row}>
                    <View style={styles.inputWrap}>
                      <Text style={styles.priceLabel}>
                        {translate('MINIMUM')}
                      </Text>
                      <TextInput
                        keyboardType={'numeric'}
                        // placeholder={"1500 KD"}
                        style={styles.input}
                        placeholderTextColor="rgb(154,154,154)"
                        maxLength={8}
                        onChangeText={text => this.setState({priceFrom: text})}
                        value={priceFrom}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.priceLabel}>
                        {translate('MAXIMUM')}
                      </Text>
                      <TextInput
                        keyboardType={'numeric'}
                        //placeholder={"15000 KD"}
                        placeholderTextColor="rgb(154,154,154)"
                        style={styles.input}
                        maxLength={8}
                        onChangeText={text => this.setState({priceTo: text})}
                        value={priceTo}
                      />
                    </View>
                  </View>
                </View>

                {/* <View style={styles.discountWrap}>
            {isDidcountAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() => this.setState({ discount: !discount })}
              >
                <Image
                  source={
                    discount
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: discount
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>{translate("Discount")}</Text>
              </TouchableOpacity>
            )}

            {isBalloonsAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() =>
                  this.setState({ isBalloonsSelected: !isBalloonsSelected })
                }
              >
                <Image
                  source={
                    isBalloonsSelected
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: isBalloonsSelected
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>{translate("Balloons")}</Text>
              </TouchableOpacity>
            )}

            {isGiftwrapAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() =>
                  this.setState({ isGiftwrapSelected: !isGiftwrapSelected })
                }
              >
                <Image
                  source={
                    isGiftwrapSelected
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: isGiftwrapSelected
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>{translate("Giftwrap")}</Text>
              </TouchableOpacity>
            )}

            {isFreeDeliveryAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() =>
                  this.setState({
                    isFreeDeliverySelected: !isFreeDeliverySelected,
                  })
                }
              >
                <Image
                  source={
                    isFreeDeliverySelected
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: isFreeDeliverySelected
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>
                  {translate("Free Delivery")}
                </Text>
              </TouchableOpacity>
            )}

            {isDeliveryOnAppointmentAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() =>
                  this.setState({
                    isDeliveryOnAppointmentSelected: !isDeliveryOnAppointmentSelected,
                  })
                }
              >
                <Image
                  source={
                    isDeliveryOnAppointmentSelected
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: isDeliveryOnAppointmentSelected
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>
                  {translate("Delivery on appointmnet")}
                </Text>
              </TouchableOpacity>
            )}

            {isSameDayDeliveryAvailable && (
              <TouchableOpacity
                activeOpacity={constants.activeOpacity}
                style={styles.checkBoxContain}
                onPress={() =>
                  this.setState({ sameDayDelivery: !sameDayDelivery })
                }
              >
                <Image
                  source={
                    sameDayDelivery
                      ? images.checkboxTick
                      : images.filterIcons.check_outline
                  }
                  style={[
                    styles.checkBoxIcon1,
                    {
                      tintColor: sameDayDelivery
                        ? constants.APP_THEME_COLOR
                        : constants.APP_GRAY_COLOR4,
                    },
                  ]}
                />
                <Text style={styles.listText2}>
                  {translate("Sameday Delivery")}
                </Text>
                <View style={styles.truckContainer}>
                  <Image
                    source={images.productTruck2}
                    style={styles.deliveryIcon}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View> */}

                {/* {isAdvanceFilterAvailable.length > 0 && (
            <View style={styles.wrapper}>
              <TouchableOpacity
                onPress={this._didTapOnAdvanceFilter}
                style={{}}
              >
                <Text style={styles.advanceFilter}>
                  {translate("ADVANCE FILTER")}
                </Text>
              </TouchableOpacity>
            </View>
          )} */}

                {isShowAdvanceFilter && (
                  <View>
                    <FlatList
                      listKey={'ADVANCE_FILTER'}
                      data={filterArray}
                      renderItem={this._renderAdvanceFilterOptions}
                      keyExtractor={item => item.id + Math.random()}
                    />
                  </View>
                )}

                <View style={styles.wrapper}>
                  <TouchableOpacity
                    style={styles.filterBtn}
                    activeOpacity={constants.activeOpacity}
                    onPress={() => {
                      this._didTapOnFilter();
                    }}>
                    <Text style={styles.btnText}>
                      {translate('APPLY FILTER').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}></FlatList>

        {isLoading && <HudView />}
      </SafeAreaView>
    );
  }
}
