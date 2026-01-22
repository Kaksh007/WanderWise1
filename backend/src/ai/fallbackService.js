/**
 * Rule-based fallback recommender when LLM fails
 */
class FallbackService {
  // Budget-based destination mapping
  budgetDestinations = {
    low: [
      { name: 'Thailand', country: 'Thailand', reason: 'Affordable Southeast Asian destination with rich culture, beautiful beaches, and delicious food. Great value for money.' },
      { name: 'Vietnam', country: 'Vietnam', reason: 'Budget-friendly destination with stunning landscapes, rich history, and incredible street food scene.' },
      { name: 'Nepal', country: 'Nepal', reason: 'Perfect for trekking and adventure on a budget. Home to the Himalayas and rich cultural heritage.' },
      { name: 'India', country: 'India', reason: 'Diverse culture, incredible food, and affordable travel. From mountains to beaches, something for everyone.' },
      { name: 'Portugal', country: 'Portugal', reason: 'Affordable European destination with beautiful coastlines, historic cities, and great food.' },
    ],
    medium: [
      { name: 'Japan', country: 'Japan', reason: 'Perfect blend of traditional culture and modern innovation. Excellent food, safe, and fascinating.' },
      { name: 'Spain', country: 'Spain', reason: 'Vibrant culture, beautiful architecture, amazing food scene, and diverse landscapes from beaches to mountains.' },
      { name: 'Greece', country: 'Greece', reason: 'Stunning islands, rich history, delicious Mediterranean cuisine, and beautiful beaches.' },
      { name: 'Costa Rica', country: 'Costa Rica', reason: 'Eco-tourism paradise with rainforests, beaches, and incredible biodiversity.' },
      { name: 'New Zealand', country: 'New Zealand', reason: 'Adventure capital with stunning natural beauty, perfect for outdoor activities.' },
    ],
    high: [
      { name: 'Switzerland', country: 'Switzerland', reason: 'Breathtaking Alpine scenery, luxury experiences, and world-class cities.' },
      { name: 'Iceland', country: 'Iceland', reason: 'Unique landscapes with geysers, glaciers, and Northern Lights. Perfect for nature lovers.' },
      { name: 'Maldives', country: 'Maldives', reason: 'Luxury beach paradise with overwater bungalows and pristine waters.' },
      { name: 'Dubai', country: 'UAE', reason: 'Ultra-modern city with luxury shopping, amazing architecture, and desert adventures.' },
      { name: 'Norway', country: 'Norway', reason: 'Stunning fjords, Northern Lights, and pristine wilderness. Perfect for nature and adventure.' },
    ],
  }

  // Travel style adjustments
  styleAdjustments = {
    trekking: ['Nepal', 'New Zealand', 'Peru', 'Nepal', 'Switzerland'],
    relaxation: ['Maldives', 'Bali', 'Thailand', 'Greece', 'Costa Rica'],
    culture: ['Japan', 'India', 'Italy', 'Spain', 'Greece'],
    adventure: ['New Zealand', 'Costa Rica', 'Nepal', 'Iceland', 'Norway'],
    beach: ['Maldives', 'Thailand', 'Greece', 'Bali', 'Costa Rica'],
    city: ['Tokyo', 'New York', 'London', 'Paris', 'Dubai'],
  }

  /**
   * Generate fallback recommendations
   */
  generateRecommendations(userInput) {
    const { budgetRange, travelStyle, lengthDays, interests } = userInput

    // Get base destinations from budget
    let candidates = this.budgetDestinations[budgetRange] || this.budgetDestinations.medium

    // Adjust based on travel style
    if (this.styleAdjustments[travelStyle]) {
      // Mix style-specific destinations with budget destinations
      candidates = [
        ...candidates.slice(0, 3),
        ...this.styleAdjustments[travelStyle].slice(0, 2).map(name => ({
          name,
          country: name,
          reason: `Great for ${travelStyle} travel with diverse experiences.`,
        })),
      ]
    }

    // Limit to 5 destinations
    candidates = candidates.slice(0, 5)

    // Generate structured recommendations
    return {
      candidates: candidates.map((dest, index) => ({
        name: dest.name,
        score: 7 + (index % 3), // Score between 7-9
        reason: dest.reason,
        topPlaces: this.generateTopPlaces(dest.name, travelStyle),
        sampleItineraryText: this.generateItinerary(dest.name, lengthDays, travelStyle),
      })),
    }
  }

  /**
   * Generate top 5 places for a destination
   */
  generateTopPlaces(destinationName, travelStyle) {
    const placeTemplates = {
      trekking: [
        { name: 'Mountain Trails', description: 'Scenic hiking routes with stunning views' },
        { name: 'Base Camp', description: 'Starting point for major treks' },
        { name: 'National Park', description: 'Protected wilderness area' },
        { name: 'Viewpoint', description: 'Panoramic mountain vistas' },
        { name: 'Adventure Center', description: 'Outdoor activity hub' },
      ],
      relaxation: [
        { name: 'Beach Resort', description: 'Pristine beaches and calm waters' },
        { name: 'Spa Center', description: 'Wellness and relaxation facilities' },
        { name: 'Scenic Overlook', description: 'Peaceful viewpoints' },
        { name: 'Garden Park', description: 'Tranquil green spaces' },
        { name: 'Cultural Site', description: 'Historic and peaceful location' },
      ],
      culture: [
        { name: 'Historic Museum', description: 'Rich cultural artifacts and history' },
        { name: 'Ancient Temple', description: 'Traditional religious site' },
        { name: 'Cultural District', description: 'Traditional neighborhoods' },
        { name: 'Art Gallery', description: 'Local and international art' },
        { name: 'Historic Square', description: 'Central cultural gathering place' },
      ],
      default: [
        { name: 'Main Attraction', description: 'Primary tourist destination' },
        { name: 'Historic Site', description: 'Significant historical location' },
        { name: 'Cultural Center', description: 'Local culture and traditions' },
        { name: 'Scenic Viewpoint', description: 'Beautiful panoramic views' },
        { name: 'Local Market', description: 'Authentic local experience' },
      ],
    }

    return placeTemplates[travelStyle] || placeTemplates.default
  }

  /**
   * Generate sample itinerary
   */
  generateItinerary(destinationName, days, travelStyle) {
    const activities = {
      trekking: [
        'Morning: Early start for trekking trail',
        'Midday: Reach scenic viewpoint, enjoy packed lunch',
        'Afternoon: Continue trek, explore natural features',
        'Evening: Return to base, rest and local dinner',
      ],
      relaxation: [
        'Morning: Breakfast at resort, beach time',
        'Midday: Spa treatment or pool relaxation',
        'Afternoon: Light exploration or reading',
        'Evening: Sunset viewing and dinner',
      ],
      culture: [
        'Morning: Visit historic museum or temple',
        'Midday: Traditional local lunch',
        'Afternoon: Explore cultural district and markets',
        'Evening: Cultural performance or local dinner',
      ],
      default: [
        'Morning: Visit main attractions',
        'Midday: Local cuisine experience',
        'Afternoon: Explore neighborhoods',
        'Evening: Relax and enjoy local atmosphere',
      ],
    }

    const dayPlan = activities[travelStyle] || activities.default
    return `Sample ${days}-day itinerary for ${destinationName}:\n\nDay 1:\n${dayPlan.join('\n')}\n\nNote: Adjust activities based on your interests and check local travel advisories.`
  }
}

export default new FallbackService()

