import React, { useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import BottomSheet from '@gorhom/bottom-sheet';
import { ArrowLeft, Download, Share2, Heart, Box, Image as ImageIcon, Lock, Copy, Save } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WallpaperItem {
  id: string;
  url: string;
  category: string;
}

export default function DetailsScreen() {
  const { id, allWallpapers } = useLocalSearchParams<{ id: string; allWallpapers: string }>();
  const router = useRouter();
  
  // Parse the wallpapers list
  const wallpaperList: WallpaperItem[] = useMemo(() => {
    return allWallpapers ? JSON.parse(allWallpapers) : [];
  }, [allWallpapers]);

  // Find the index of the image clicked on the Home screen
  const initialIndex = useMemo(() => {
    return wallpaperList.findIndex(item => item.id === id);
  }, [id, wallpaperList]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const openOptions = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      {/* 2. PagerView now loops through all fetched images for swiping */}
      <PagerView 
        style={styles.pagerView} 
        initialPage={initialIndex >= 0 ? initialIndex : 0}
      >
        {wallpaperList.map((item) => (
          <View key={item.id} style={styles.page}>
            <Pressable style={styles.page} onPress={openOptions}>
              <Image 
                source={{ uri: item.url }} 
                style={styles.fullImage} 
                contentFit="cover" 
                transition={800}
              />
            </Pressable>
          </View>
        ))}
      </PagerView>

      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorName}>Premium Artist</Text>
          <Text style={styles.aiTag}>4K Extraordinary Quality</Text>
        </View>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.subAction} activeOpacity={0.7}>
          <Share2 color="#fff" size={26} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mainDownload} onPress={openOptions}>
          <Download color="#fff" size={32} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.subAction} activeOpacity={0.7}>
          <Heart color="#fff" size={26} />
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#121212' }}
        handleIndicatorStyle={{ backgroundColor: '#444' }}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>What Would You Like to Do?</Text>
          <OptionItem icon={<Box color="#fff" size={24}/>} label="Make 3D Parallax" />
          <OptionItem icon={<ImageIcon color="#fff" size={24}/>} label="Set Wallpaper" />
          <OptionItem icon={<Lock color="#fff" size={24}/>} label="Set Lock Screen" />
          <OptionItem icon={<Copy color="#fff" size={24}/>} label="Set Both" />
          <OptionItem icon={<Save color="#fff" size={24}/>} label="Save to Media Folder" last />
        </View>
      </BottomSheet>
    </View>
  );
}

const OptionItem = ({ icon, label, last }: any) => (
  <TouchableOpacity style={[styles.optionItem, last && { borderBottomWidth: 0 }]} activeOpacity={0.6}>
    <View style={styles.optionLeft}>
      {icon}
      <Text style={styles.optionText}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  pagerView: { flex: 1 },
  page: { width, flex: 1 },
  fullImage: { width: '100%', height: '100%' },
  topNav: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  iconCircle: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30 },
  creatorInfo: { marginLeft: 15 },
  creatorName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  aiTag: { color: '#ccc', fontSize: 12 },
  actionRow: { position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 50, zIndex: 10 },
  mainDownload: { backgroundColor: '#6366f1', width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 12, shadowColor: '#6366f1', shadowOpacity: 0.5, shadowRadius: 10 },
  subAction: { padding: 10 },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 20 },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 20 },
  optionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  optionText: { color: '#fff', fontSize: 17, fontWeight: '500' }
});