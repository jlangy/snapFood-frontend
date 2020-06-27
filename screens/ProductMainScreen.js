import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Portal, Modal, TextInput, Text, Title, HelperText } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { t } from 'react-native-tailwindcss';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledButton from '../components/StyledButton';
import SortByMenu from '../components/DropDownMenu/SortByMenu';
import StoresMenu from '../components/DropDownMenu/StoresMenu';
import SnackBar from '../components/SnackBar';
import ProductMainCard from '../components/ProductMainCard';
import SearchBar from '../components/SearchBar';
import LikedCounter from '../components/LikedCounter';
import Map from '../components/Map';

export default function ProductMainScreen({ navigation }) {
  // For account button to open drawer navigator
  // const navigation = useNavigation();
  const [searchRadius, setSearchRadius] = useState('499');
  const [posts, setPosts] = React.useState([]);
  const [activeTags, setActiveTags] = React.useState([]);
  const [sort, setSort] = React.useState('Sort: Rating');
  const [refineModalVisible, setRefineModalVisibility] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const showRefineModal = () => setRefineModalVisibility(true);
  const hideRefineModal = () => setRefineModalVisibility(false);
  const handleRefineModalPress = () => {
    showRefineModal();
  };

  const loadData = async () => {
    const searchUri = `https://glacial-cove-31720.herokuapp.com/posts?latitude=5.2&longitude=4.3&radius=${searchRadius}000${activeTags.map(
      (tag) => `&tag=${tag}`
    )}`;
    const apiData = await fetch(searchUri);
    const responseText = await apiData.text();
    const loadedPosts = JSON.parse(responseText).posts;
    setPosts(sortPosts(loadedPosts) || []);
  };

  React.useEffect(() => {
    loadData();
  }, [activeTags, searchRadius]);

  React.useEffect(() => {
    setPosts(sortPosts(posts) || []);
  }, [sort]);

  const sortPosts = (currentPosts) => {
    if (!currentPosts) return null;
    switch (sort) {
      case 'Sort: Rating':
        return currentPosts.slice(0).sort((a, b) => b.likes - a.likes);
      case 'Sort: Distance':
        return currentPosts.slice(0).sort((a, b) => a.distance - b.distance);
      case 'Sort: Best Deal':
        return currentPosts
          .slice(0)
          .sort((a, b) => a.price - a.discountPrice - (b.price - b.discountPrice));
      case 'Sort: Most Recent':
        return currentPosts
          .slice(0)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return currentPosts;
    }
  };
  const toMapView = () => {
    setShowMap(!showMap);
  };
  // Default 5km for the placeholder
  const [distance, setDistance] = useState('');

  const DistanceEntryError = () => {
    function isNormalInteger(str) {
      if (!str) return true;
      const trimStr = str.trim();
      if (!trimStr) {
        return false;
      }
      const input = trimStr.replace(/^0+/, '') || '0';
      const n = Math.floor(Number(input));
      return n !== Infinity && String(n) === input && n >= 0 && n < 500;
    }

    const errorVisibility = !isNormalInteger(searchRadius);

    return (
      <HelperText type="error" visible={errorVisibility}>
        Invalid Entry. Please enter an integer between 0 and 200.
      </HelperText>
    );
  };

  return (
    <SafeAreaView style={[t.flex1, t.bgWhite]}>
      <View style={[t.flexRow, t.itemsCenter]}>
        {/* Account Button to open drawer navigator */}
        <StyledButton
          icon="account-circle-outline"
          title="Account"
          size="small"
          onPress={() => navigation.openDrawer()}
        />
        {/* Searchbar Placeholder */}

        {/* Refine Modal */}
        <Portal>
          <Modal
            contentContainerStyle={[t.bgWhite]}
            visible={refineModalVisible}
            onDismiss={hideRefineModal}
          >
            <Title style={[t.textCenter]}>SORT BY</Title>
            <SortByMenu setSort={setSort} />
            <Title style={[t.textCenter]}>FILTER BY</Title>
            <View style={[t.flexRow, t.itemsCenter]}>
              <TextInput
                label="Distance"
                value={searchRadius}
                mode="outline"
                placeholder="5"
                onChangeText={(text) => setSearchRadius(text)}
                style={[t.w3_4, t.m2]}
              />
              <Text>km</Text>
            </View>
            <DistanceEntryError />
            <StoresMenu />
          </Modal>
        </Portal>
        <StyledButton
          icon="playlist-edit"
          title="Refine"
          size="small"
          onPress={handleRefineModalPress}
        />
        {/* MapView / ListView Toggle Button Placeholder */}
        <StyledButton
          size="small"
          icon={showMap ? 'view-list' : 'map-outline'}
          onPress={toMapView}
        />
      </View>
      <SearchBar
        searcher={1}
        latitude="20"
        longitude="10"
        radius="10000000"
        setActiveTags={setActiveTags}
        activeTags={activeTags}
      />
      {showMap ? (
        <Map />
      ) : (
        <ScrollView contentContainerStyle={[t.p6]}>
          {/* Product card for product main page */}
          {posts.map((post) => (
            <ProductMainCard
              price={{ regular: post.price, discounted: post.discountPrice }}
              totalVotes={post.likes}
              storeName={post.storename}
              address={post.address}
              created={post.createdAt}
              distance={post.distance}
              initialUserSavedPost={post.userSavedPost}
              userLikedPost={post.userLikedPost}
              userDislikedPost={post.userDislikedPost}
              likes={post.likes}
              postId={post.id}
              key={post.id}
            />
          ))}
        </ScrollView>
      )}
      <SnackBar />
    </SafeAreaView>
  );
}
