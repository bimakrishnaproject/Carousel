import { data } from '@/constants';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import PagerView from 'react-native-pager-view';

const { width, height } = Dimensions.get('window');

export default function CardCarousel() {
  const [activeCard, setActiveCard] = useState<string | number | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const [headerAnimation] = useState(new Animated.Value(0));
  const [bgColorApplied, setBgColorApplied] = useState(false);

  const handleCardPress = (id: any) => {
    if (activeCard === id) {
      setBgColorApplied(false);
      Animated.parallel([
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(headerAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveCard(null);
      });
    } else {
      setActiveCard(id);
      setBgColorApplied(true);
      Animated.parallel([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(headerAnimation, {
          toValue: -width,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const expandedStyle = useMemo(
    () => ({
      width: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width, width],
      }),
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [400, height],
      }),
      marginTop: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.33, width * 0.1],
      }),
      top: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width * -0.24, 0],
      }),
    }),
    [animation]
  );

  const headerStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: headerAnimation.interpolate({
            inputRange: [-width, 0],
            outputRange: [-width, 0],
          }),
        },
      ],
    }),
    [headerAnimation]
  );

  return (
    <View style={styles.container}>
      {/* // HEADER */}
      <Animated.View
        style={[
          styles.headerContainer,
          activeCard && {
            position: 'absolute',
            zIndex: 10,
          },
          headerStyle,
        ]}
      >
        <View style={styles.headerContent}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
            }}
            style={{ width: width * 0.12, height: width * 0.12 }}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 15 }}>
            John Doe
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://png.pngtree.com/png-vector/20220527/ourmid/pngtree-chat-box-icon-web-white-png-image_4756254.png',
          }}
          style={{ width: width * 0.11, height: width * 0.11 }}
        />
      </Animated.View>

      {/* // CONTENT */}
      <PagerView style={styles.pagerView} initialPage={0}>
        {data.map((item) => (
          <View style={styles.page} key={item.id}>
            <View>
              <Animated.View
                style={[
                  styles.card,
                  activeCard === item.id ? expandedStyle : {},
                ]}
              >
                <View
                  style={[
                    styles.textContainer,
                    activeCard === item.id && bgColorApplied
                      ? { backgroundColor: '#141414' }
                      : {},
                  ]}
                >
                  <View style={{ width: '80%' }}>
                    <Text
                      style={[styles.cardTitle, { marginTop: width * 0.2 }]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardTitleDetails,
                        { marginTop: width * 0.03 },
                      ]}
                    >
                      {item.details}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={[
                    styles.image,
                    activeCard === item.id ? styles.imageExpanded : {},
                  ]}
                  onPress={() => handleCardPress(item.id)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[
                      styles.image,
                      activeCard === item.id ? styles.imageExpanded : {},
                    ]}
                  />
                </Pressable>
                {!activeCard ? (
                  <ScrollView>
                    <View style={{ padding: width * 0.04 }}>
                      <Text style={{ fontSize: width * 0.04 }}>
                        {item?.description}
                      </Text>
                    </View>
                  </ScrollView>
                ) : null}
              </Animated.View>
            </View>
          </View>
        ))}
      </PagerView>

      {/* // FOOTER */}
      <TouchableOpacity
        style={[
          styles.footer,
          Platform.select({
            ios: { paddingBottom: width * 0.04 },
            android: { paddingBottom: width * 0.04 },
          }),
        ]}
      >
        <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>
          Order here
        </Text>
      </TouchableOpacity>

      {/* // X BUTTON */}
      {activeCard && (
        <Animated.View style={[styles.detailsContainer]}>
          <Pressable onPress={() => handleCardPress(activeCard)}>
            <Image
              source={{
                uri: 'https://img.icons8.com/p1em/200/FFFFFF/filled-cancel.png',
              }}
              style={{ width: 50, height: 50 }}
            />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.05,
    top: width * 0.02,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'white',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
  },
  imageExpanded: {
    height: '100%',
  },
  textContainer: {
    padding: width * 0.08,
    zIndex: 100,
    position: 'absolute',
    width: '100%',
  },
  cardTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: 'white',
  },
  cardTitleDetails: {
    fontSize: 15,
    color: 'white',
  },
  footer: {
    backgroundColor: 'white',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderColor: 'grey',
  },
  detailsContainer: {
    position: 'absolute',
    top: width * 0.08,
    left: 0,
    right: width * 0.03,
    bottom: 0,
    alignItems: 'flex-end',
  },
});
