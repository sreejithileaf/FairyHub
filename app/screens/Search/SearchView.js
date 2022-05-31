/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 18, 2020
 * Search View - Search UI
 */

import {
  View,
  Text,
  Image,
  Keyboard,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import React, {Component} from 'react';
import Images from '../../config/images';
import Constants from '../../config/constants';
import {translate} from '../../config/languageSwitching/index';
import EmptyDataPlaceholder from '../../components/emptyDataPlaceholder';

class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      keyboardHeight: 0,
      topSearches: [],
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.props.getTopSearches(topSearches => {
      this.setState({topSearches});
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = e => {
    this.setState({keyboardHeight: e.endCoordinates.height});
  };

  _keyboardDidHide = () => {
    this.setState({keyboardHeight: 0});
  };

  _didTapOnLeftButton = () => {
    this.props.navigation.goBack();
    this.props.clearSearchResult();
  };

  _didSearchSubmit = query => {
    if (query !== '') {
      this.props.navigation.navigate('ProductResultCategory', {
        searchText: query,
      });
    }
  };

  _searchHistoryItem = query => {
    const {searchHistoryarray} = this.props;
    if (query === '' || searchHistoryarray.length == 0) {
      return searchHistoryarray;
    }
    // const regex = new RegExp(`${query.trim()}`, "i");
    // return searchHistoryarray.filter((item) => item.name.search(regex) >= 0);

    // return searchHistoryarray.filter((l) => {
    //   return l.name.toLowerCase().match(query.toLowerCase());
    // });
    let text = query.toLowerCase();

    const newData = searchHistoryarray.filter(item => {
      const itemData = `${item.name.toUpperCase()}   
      ${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    return newData;
  };

  _clearSearchHistory = () => {
    this.props.updateSearchHistory([]);
  };

  _didSelectProduct = (item, isFromHistory) => {
    const {searchHistoryarray} = this.props;
    if (!isFromHistory) {
      let filterdArray = searchHistoryarray.filter(dd => item.id == dd.id);
      if (filterdArray.length == 0)
        this.props.updateSearchHistory([...searchHistoryarray, ...[item]]);
    }

    this.props.navigation.navigate('ProductDetail', {
      sku: item.sku,
    });
  };

  render() {
    const {
      isRTL,
      isLoading,
      screenWidth,
      onSearchTextChange,
      searchResultArray,
      searchHistoryarray,
    } = this.props;
    const {query, keyboardHeight, topSearches} = this.state;
    const searchHistoryArray = this._searchHistoryItem(query);
    const comp = (a, b) =>
      a.toLowerCase().trim() === b.name.toLowerCase().trim();
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={this._didTapOnLeftButton}>
            <Image
              source={Images.backButton}
              resizeMode={'contain'}
              style={{
                marginLeft: 20,
                width: 17,
                height: 17,
                transform: [{rotate: isRTL ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>
          <View style={styles.searchMainContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
              <Image source={Images.searchNew} />
            </TouchableOpacity>
            <TextInput
              placeholder={translate('Search')}
              clearButtonMode
              returnKeyType={'search'}
              onSubmitEditing={() => this._didSearchSubmit(this.state.query)}
              defaultValue={query}
              onChangeText={text => {
                this.setState({query: text});
                if (text.length > 3) onSearchTextChange(text);
                if (text.length == 0) this.props.clearSearchResult();
              }}
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontSize: 15,
                flex: 1,
                height: 40,
                // textAlign: "left",
                // marginLeft: 35,
                fontFamily: Constants.Fonts.REGULAR,
                color: Constants.APP_GRAY_COLOR3,
                placeholderTextColor: 'rgb(152,152,152)',
              }}
            />
          </View>
        </View>
        <View style={styles.separatorView} />
        {isLoading && <ActivityIndicator style={{marginTop: 10}} />}

        {topSearches.length > 0 ||
        searchHistoryArray.length > 0 ||
        searchResultArray.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={[1]}
            renderItem={() => {
              return (
                <View>
                  <View>
                    {query.length > 3 &&
                      !isLoading &&
                      searchResultArray.length == 0 && (
                        <View style={{}}>
                          <EmptyDataPlaceholder
                            isFromSearchScreen
                            titleText={translate('No matching search results')}
                            descriptionText={translate(
                              'search_result_empty_placeholder',
                            )}
                            placeHolderImage={Images.emptySearchResult}
                          />
                        </View>
                      )}

                    {/* <View style={styles.searchHeadingContainer}>
                <Text style={styles.searchHeadingText}>{translate("Recent Searches").toUpperCase()}</Text>
              </View> */}
                    <FlatList
                      listKey={'1'}
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        marginHorizontal: 20,
                        flex: 1,
                        marginBottom: 10,
                      }}
                      data={searchResultArray}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            height: 40,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomColor: Constants.APP_SEPARATOR_COLOR,
                            // borderBottomWidth: 1,
                            width: screenWidth - 40,
                          }}
                          onPress={() => this._didSelectProduct(item, false)}>
                          <Image
                            style={{
                              tintColor: Constants.APP_GRAY_COLOR3,
                            }}
                            source={Images.searchNew}
                          />
                          <Text style={styles.searchHistoryText}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps={'handled'}
                    />
                    {/* <View style={styles.searchHeadingContainer}>
                <Text style={styles.searchHeadingText}>{translate("Top Searches").toUpperCase()}</Text>
              </View> */}
                    {searchHistoryArray.length > 0 && (
                      <View style={styles.searchHeadingContainer}>
                        <Text style={styles.searchHeadingText}>
                          {translate('Recent Searches').toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <FlatList
                      listKey={'2'}
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{marginHorizontal: 20, flex: 1}}
                      data={
                        searchHistoryArray.length === 1 &&
                        comp(query, searchHistoryArray[0])
                          ? []
                          : searchHistoryArray
                      }
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            height: 40,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomColor: Constants.APP_SEPARATOR_COLOR,
                            // borderBottomWidth: 1,
                            width: screenWidth - 40,
                          }}
                          onPress={() => this._didSelectProduct(item, false)}>
                          <Image
                            style={{
                              tintColor: Constants.APP_GRAY_COLOR3,
                            }}
                            source={Images.searchNew}
                          />
                          <Text style={styles.searchHistoryText}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps={'handled'}
                    />

                    {topSearches.length > 0 && (
                      <View style={styles.searchHeadingContainer}>
                        <Text style={styles.searchHeadingText}>
                          {translate('Top Searches').toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <FlatList
                      listKey={'3'}
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        marginHorizontal: 20,
                        flex: 1,
                        marginBottom: 20,
                      }}
                      data={topSearches}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            height: 40,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomColor: Constants.APP_SEPARATOR_COLOR,
                            // borderBottomWidth: 1,
                            width: screenWidth - 40,
                          }}
                          onPress={() => this._didSelectProduct(item, false)}>
                          <Image
                            style={{
                              tintColor: Constants.APP_GRAY_COLOR3,
                            }}
                            source={Images.searchNew}
                          />
                          <Text style={styles.searchHistoryText}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps={'handled'}
                    />
                    <View
                      style={{
                        height: Constants.IS_ANDROID ? 0 : keyboardHeight,
                      }}
                    />
                  </View>
                </View>
              );
            }}></FlatList>
        ) : (
          query.length > 0 &&
          !isLoading && (
            <EmptyDataPlaceholder
              titleText={translate('No matching search results')}
              descriptionText={translate('search_result_empty_placeholder')}
              placeHolderImage={Images.emptySearchResult}
            />
          )
        )}
      </SafeAreaView>
    );
  }
}

export default SearchView;
