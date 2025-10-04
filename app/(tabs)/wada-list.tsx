
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { GlassView } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { wadaSubstances, wadaCategories, getSubstancesByCategory, searchSubstances, WADASubstance } from '@/data/wadaSubstances';
import * as Haptics from 'expo-haptics';

type ViewMode = 'categories' | 'search' | 'category-detail';

export default function WADAListScreen() {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedSubstance, setExpandedSubstance] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchSubstances(searchQuery);
  }, [searchQuery]);

  const categorySubstances = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubstancesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryPress = (category: string) => {
    console.log('Category selected:', category);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    setViewMode('category-detail');
  };

  const handleSubstancePress = (substanceId: string) => {
    console.log('Substance pressed:', substanceId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSubstance(expandedSubstance === substanceId ? null : substanceId);
  };

  const handleBackPress = () => {
    console.log('Back pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (viewMode === 'category-detail') {
      setViewMode('categories');
      setSelectedCategory('');
    } else if (viewMode === 'search') {
      setViewMode('categories');
      setSearchQuery('');
    }
  };

  const getProhibitionStatusColor = (status: string) => {
    switch (status) {
      case 'always':
        return '#FF3B30';
      case 'in-competition':
        return '#FF9500';
      case 'particular-sports':
        return '#007AFF';
      default:
        return theme.colors.text;
    }
  };

  const getProhibitionStatusText = (status: string) => {
    switch (status) {
      case 'always':
        return 'Always Prohibited';
      case 'in-competition':
        return 'In-Competition Only';
      case 'particular-sports':
        return 'Particular Sports';
      default:
        return 'Unknown';
    }
  };

  const renderSubstanceCard = (substance: WADASubstance) => {
    const isExpanded = expandedSubstance === substance.id;
    
    return (
      <Pressable
        key={substance.id}
        onPress={() => handleSubstancePress(substance.id)}
      >
        <GlassView 
          style={[
            styles.substanceCard,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={styles.substanceHeader}>
            <View style={styles.substanceInfo}>
              <Text style={[styles.substanceName, { color: theme.colors.text }]}>
                {substance.name}
              </Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getProhibitionStatusColor(substance.prohibitedStatus) + '20' }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { color: getProhibitionStatusColor(substance.prohibitedStatus) }
                ]}>
                  {getProhibitionStatusText(substance.prohibitedStatus)}
                </Text>
              </View>
            </View>
            <IconSymbol 
              name={isExpanded ? "chevron.up" : "chevron.down"} 
              color={theme.dark ? '#98989D' : '#666'} 
              size={16} 
            />
          </View>
          
          {isExpanded && (
            <View style={styles.substanceDetails}>
              <Text style={[styles.substanceDescription, { color: theme.dark ? '#98989D' : '#666' }]}>
                {substance.description}
              </Text>
              
              {substance.subcategory && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                    Subcategory:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.dark ? '#98989D' : '#666' }]}>
                    {substance.subcategory}
                  </Text>
                </View>
              )}
              
              {substance.examples && substance.examples.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                    Examples:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.dark ? '#98989D' : '#666' }]}>
                    {substance.examples.join(', ')}
                  </Text>
                </View>
              )}
              
              {substance.notes && (
                <View style={styles.notesContainer}>
                  <IconSymbol name="info.circle" color="#FF9500" size={16} />
                  <Text style={[styles.notesText, { color: theme.dark ? '#98989D' : '#666' }]}>
                    {substance.notes}
                  </Text>
                </View>
              )}
            </View>
          )}
        </GlassView>
      </Pressable>
    );
  };

  const renderCategories = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS !== 'ios' && styles.scrollContentWithTabBar
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          WADA Prohibited List
        </Text>
        <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
          Browse substances prohibited by the World Anti-Doping Agency
        </Text>
      </View>

      <Pressable
        onPress={() => setViewMode('search')}
        style={styles.searchButton}
      >
        <GlassView 
          style={[
            styles.searchButtonContent,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <IconSymbol name="magnifyingglass" color={theme.dark ? '#98989D' : '#666'} size={20} />
          <Text style={[styles.searchButtonText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Search substances...
          </Text>
        </GlassView>
      </Pressable>

      <View style={styles.categoriesContainer}>
        {wadaCategories.map((category, index) => {
          const substanceCount = getSubstancesByCategory(category).length;
          const categoryCode = category.split('.')[0];
          
          return (
            <Pressable
              key={category}
              onPress={() => handleCategoryPress(category)}
            >
              <GlassView 
                style={[
                  styles.categoryCard,
                  Platform.OS !== 'ios' && { 
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
                  }
                ]} 
                glassEffectStyle="regular"
              >
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryCode, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Text style={[styles.categoryCodeText, { color: theme.colors.primary }]}>
                      {categoryCode}
                    </Text>
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                      {category.split('. ')[1] || category}
                    </Text>
                    <Text style={[styles.categoryCount, { color: theme.dark ? '#98989D' : '#666' }]}>
                      {substanceCount} substance{substanceCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <IconSymbol 
                    name="chevron.right" 
                    color={theme.dark ? '#98989D' : '#666'} 
                    size={16} 
                  />
                </View>
              </GlassView>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderSearch = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS !== 'ios' && styles.scrollContentWithTabBar
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchContainer}>
        <GlassView 
          style={[
            styles.searchInputContainer,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <IconSymbol name="magnifyingglass" color={theme.dark ? '#98989D' : '#666'} size={20} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search substances..."
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" color={theme.dark ? '#98989D' : '#666'} size={20} />
            </Pressable>
          )}
        </GlassView>
      </View>

      {searchQuery.length >= 2 && (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </Text>
          {searchResults.map(renderSubstanceCard)}
        </View>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <View style={styles.noResultsContainer}>
          <IconSymbol name="magnifyingglass" color={theme.dark ? '#98989D' : '#666'} size={48} />
          <Text style={[styles.noResultsTitle, { color: theme.colors.text }]}>
            No substances found
          </Text>
          <Text style={[styles.noResultsText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Try searching with different keywords or browse by category
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderCategoryDetail = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS !== 'ios' && styles.scrollContentWithTabBar
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {selectedCategory.split('. ')[1] || selectedCategory}
        </Text>
        <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
          {categorySubstances.length} substance{categorySubstances.length !== 1 ? 's' : ''} in this category
        </Text>
      </View>

      <View style={styles.substancesContainer}>
        {categorySubstances.map(renderSubstanceCard)}
      </View>
    </ScrollView>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        Alert.alert(
          'About WADA List',
          'This list is based on the World Anti-Doping Agency (WADA) Prohibited List. Always consult official WADA documentation and your sports organization for the most current information.',
          [{ text: 'OK' }]
        );
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="info.circle" color={theme.colors.primary} size={24} />
    </Pressable>
  );

  const renderHeaderLeft = () => {
    if (viewMode === 'categories') return null;
    
    return (
      <Pressable
        onPress={handleBackPress}
        style={styles.headerButtonContainer}
      >
        <IconSymbol name="chevron.left" color={theme.colors.primary} size={24} />
      </Pressable>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: viewMode === 'categories' ? 'WADA List' : 
                   viewMode === 'search' ? 'Search' : 
                   selectedCategory.split('.')[0],
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        {viewMode === 'categories' && renderCategories()}
        {viewMode === 'search' && renderSearch()}
        {viewMode === 'category-detail' && renderCategoryDetail()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  searchButton: {
    marginBottom: 24,
  },
  searchButtonContent: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCode: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryCodeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
  },
  resultsContainer: {
    gap: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  substancesContainer: {
    gap: 12,
  },
  substanceCard: {
    borderRadius: 16,
    padding: 20,
  },
  substanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  substanceInfo: {
    flex: 1,
  },
  substanceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  substanceDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  substanceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 18,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255,152,0,0.1)',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
