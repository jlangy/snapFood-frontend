import React, { useState, useEffect } from 'react';

import { View, Text } from 'react-native';
import ToggleButton from './ToggleButton';

const LikedCounter = ({
  likes = 0,
  dislikes = 0,
  variant = 'general',
  style = {},
  initialLiked,
  initialDisliked,
  postId,
  userId = '5eead9d6d34bf31f58a86904',
}) => {
  const [liked, setLiked] = useState(false);
  const [notLiked, setNotLiked] = useState(false);

  useEffect(() => {
    if (liked) {
      setNotLiked(false);
    }
  }, [liked]);

  useEffect(() => {
    if (notLiked) {
      setLiked(false);
    }
  }, [notLiked]);

  const toggleLikePost = (upvote) => {
    const remove = (upvote && liked) || (!upvote && notLiked);
    fetch(`http://10.0.2.2:8000/posts/${postId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        upvote,
        remove,
      }),
    });
  };

  return (
    <View>
      {variant === 'general' && (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            ...style,
          }}
        >
          <ToggleButton
            selected={liked}
            selectedIcon="thumb-up"
            unselectedIcon="thumb-up-outline"
            handleSelected={() => {
              setLiked(!liked);
            }}
          />
          <Text>{likes - dislikes}</Text>
          <ToggleButton
            selected={notLiked}
            selectedIcon="thumb-down"
            unselectedIcon="thumb-down-outline"
            handleSelected={() => {
              setNotLiked(!notLiked);
            }}
          />
        </View>
      )}
      {variant === 'detail' && (
        <View style={{ flex: 1, flexDirection: 'row', ...style }}>
          <View>
            <ToggleButton
              selected={liked}
              selectedIcon="thumb-up"
              unselectedIcon="thumb-up-outline"
              handleSelected={() => {
                setLiked(!liked);
              }}
              style={{ marginBottom: -10 }}
            />
            <Text style={{ textAlign: 'center' }}>{likes}</Text>
          </View>
          <View style={{}}>
            <ToggleButton
              selected={notLiked}
              selectedIcon="thumb-down"
              unselectedIcon="thumb-down-outline"
              handleSelected={() => {
                setNotLiked(!notLiked);
              }}
              style={{ marginBottom: -10 }}
            />
            <Text style={{ textAlign: 'center' }}>{dislikes}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default LikedCounter;
