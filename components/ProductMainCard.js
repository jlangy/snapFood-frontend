import * as React from 'react';
import { Text, View } from 'react-native';
import { Card, Portal, Modal } from 'react-native-paper';
import { t } from 'react-native-tailwindcss';
import ToggleButton from './ToggleButton';
import LikedCounter from './LikedCounter';
import ProductDetailCard from './ProductDetailCard';
import formatDistance from '../helpers/formatDistance';

export default function ProductMainCard(props) {
  const {
    timeFromNow = '1 day ago',
    price,
    storeName,
    distance,
    likes,
    dislikes,
    posterName,
    posterStatus = 'regular',
    tags = [],
    address,
    created,
    initialUserSavedPost,
    userLikedPost,
    userDislikedPost,
    postId,
    userId = '5eead9d6d34bf31f58a86904',
    imageUrl,
    isExpired = false,
  } = props;
  const [bookmarked, setBookmarked] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const [userSavedPost, setUserSavedPost] = React.useState(initialUserSavedPost);

  // const formatDistance = (rawDistance) => {
  //   if (distance < 1000) {
  //     return `${Math.round(rawDistance / 100) * 100}m`;
  //   }
  //   return `${Math.round(rawDistance / 1000)}km`;
  // };

  const toggleSavePost = () => {
    setUserSavedPost((prev) => !prev);
    fetch(`https://glacial-cove-31720.herokuapp.com/users/${userId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        saving: !userSavedPost,
      }),
    });
  };

  return (
    <View pointerEvents={isExpired ? 'none' : 'auto'}>
      <Portal>
        <Modal visible={showDetailModal} onDismiss={() => setShowDetailModal(!showDetailModal)}>
          <ProductDetailCard {...props} />
        </Modal>
      </Portal>
      <Card
        style={{
          flex: 1,
          marginHorizontal: 5,
          marginVertical: 5,
          borderColor: posterStatus === 'super' ? '#48bb78' : 'transparent',
          borderWidth: posterStatus === 'super' ? 2 : 0,
          height: 'auto',
        }}
        onLongPress={() => setShowDetailModal(!showDetailModal)}
      >
        <View style={[]}>
          <Text style={[t.textGray600, t.italic, t.pX1]}>{timeFromNow}</Text>
        </View>
        <Card.Cover source={{ uri: imageUrl }} resizeMethod="resize" resizeMode="center" />
        <Card.Content
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <LikedCounter
              initialLiked={userLikedPost}
              initialDisliked={userDislikedPost}
              postId={postId}
              likes={likes}
              dislikes={dislikes}
            />
            <ToggleButton
              selected={bookmarked}
              selectedIcon="bookmark"
              unselectedIcon="bookmark-outline"
              handleSelected={() => setBookmarked(!bookmarked)}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Text style={[t.textXl, t.mLAuto, t.textGreen900, t.pR1]}>
              ${price.discounted.toFixed(2)}
            </Text>
            <Text style={[t.lineThrough, t.textGray800]}>${price.regular.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 8,
              alignItems: 'center',
            }}
          >
            <Text style={[t.textXs]}>{storeName}</Text>
            <Text>{formatDistance(distance)}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
