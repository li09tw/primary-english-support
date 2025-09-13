# Learning Content System Documentation

## Overview

The Learning Content System is a comprehensive database-driven solution for managing educational content in the Primary English Support project. It provides a structured way to organize words, sentence patterns, and themes for different grade levels.

## Database Schema

### Core Tables

#### 1. `grades` Table
- **Purpose**: Stores grade levels (Grade 1-6)
- **Columns**:
  - `id`: Primary key
  - `name`: Grade name (e.g., "Grade 1")

#### 2. `word_themes` Table
- **Purpose**: Categorizes words into thematic groups
- **Columns**:
  - `id`: Primary key
  - `name`: Theme name (e.g., "Emotions", "Colors", "Sports")

#### 3. `words` Table
- **Purpose**: Main dictionary of words with metadata
- **Columns**:
  - `id`: Primary key
  - `english_singular`: English word in singular form
  - `english_plural`: English word in plural form (optional)
  - `chinese_meaning`: Chinese translation
  - `part_of_speech`: Word type (noun, verb, adjective, adverb, preposition)
  - `image_url`: Optional image URL
  - `audio_url`: Optional audio URL

#### 4. `sentence_patterns` Table
- **Purpose**: Stores sentence patterns for different grades
- **Columns**:
  - `id`: Primary key
  - `grade_id`: Reference to grades table
  - `pattern_text`: Sentence pattern with blanks (e.g., "I have a ____.")
  - `pattern_type`: Pattern type (Question, Statement, Response)
  - `notes`: Additional notes about the pattern

#### 5. `pattern_slots` Table
- **Purpose**: Defines what type of word each blank needs
- **Columns**:
  - `id`: Primary key
  - `pattern_id`: Reference to sentence_patterns table
  - `slot_index`: Position of the blank in the pattern
  - `required_part_of_speech`: Required word type for the blank

#### 6. `word_theme_associations` Table
- **Purpose**: Many-to-many relationship between words and themes
- **Columns**:
  - `word_id`: Reference to words table
  - `theme_id`: Reference to word_themes table

## Available Word Themes

The system includes 17 predefined themes:

1. **Emotions** - 8 words (happy, sad, angry, tired, excited, bored, surprised, scared)
2. **Colors** - 11 words (red, blue, yellow, green, black, white, pink, purple, orange, brown, gray)
3. **Sports** - 8 words (basketball, soccer, baseball, tennis, badminton, swimming, running, jogging)
4. **Stationery** - 7 words (pen, pencil, eraser, ruler, book, notebook, marker)
5. **Fruits** - 7 words (apple, banana, orange, grape, guava, lemon, strawberry)
6. **Fast Food** - 6 words (hamburger, fries, pizza, hot dog, chicken nugget, soda)
7. **Bakery & Snacks** - 6 words (bread, cake, cookie, donut, pie, candy)
8. **Days of the Week** - 7 words (Sunday through Saturday)
9. **Months** - 12 words (January through December)
10. **School Subjects** - 7 words (English, Chinese, math, science, art, music, P.E.)
11. **Ailments** - 8 words (headache, fever, cold, cough, stomachache, sore throat, runny nose, toothache)
12. **Countries** - 10 words (Taiwan, America, Japan, Korea, Canada, the U.K., China, Singapore, Thailand, France)
13. **Furniture** - 10 words (table, chair, desk, bed, sofa, lamp, bookshelf, wardrobe, mirror, rug)
14. **Toys** - 10 words (ball, car, doll, kite, robot, block, puzzle, yo-yo, scooter, teddy bear)
15. **Drinks** - 10 words (water, milk, juice, tea, coffee, coke, soy milk, papaya milk, winter melon tea, bubble tea)
16. **Main Dishes** - 10 words (rice, noodles, dumplings, bento, hot pot, beef noodle soup, fried rice, pasta, steak, sandwich)
17. **Bubble Tea Toppings** - 7 words (pearls, boba, pudding, grass jelly, aloe vera, red bean, taro balls)

## API Endpoints

### Base URL
```
/api/learning-content
```

### Available Actions

#### 1. Get All Themes
```
GET /api/learning-content?action=themes
```

#### 2. Get Words by Theme
```
GET /api/learning-content?action=words_by_theme&theme_id={theme_id}
```

**Optional Parameters**:
- `part_of_speech`: Filter by word type
- `limit`: Limit number of results
- `offset`: Pagination offset

#### 3. Get Sentence Patterns
```
GET /api/learning-content?action=sentence_patterns&grade_id={grade_id}
```

**Optional Parameters**:
- `limit`: Limit number of results
- `offset`: Pagination offset

#### 4. Get All Grades
```
GET /api/learning-content?action=grades
```

#### 5. Get Words by Part of Speech
```
GET /api/learning-content?action=words_by_part_of_speech&part_of_speech={part_of_speech}
```

#### 6. Get Random Words
```
GET /api/learning-content?action=random_words&count={count}&theme_id={theme_id}
```

## Database Integration

The learning content system uses a virtual database approach with mock data stored directly in the API route file. This provides fast access and eliminates the need for external database dependencies.

## Component Integration

### TextbookSelector Component
The updated `TextbookSelector` component now integrates with the learning content system:

```tsx
<TextbookSelector
  onVocabularySelected={(words, theme) => {
    // Handle selected vocabulary
    console.log(`Selected ${words.length} words from ${theme.name} theme`);
  }}
  selectedGrade={1}
  onGradeChange={(gradeId) => {
    // Handle grade change
    console.log(`Grade changed to ${gradeId}`);
  }}
/>
```

### Key Features
- **Grade Selection**: Choose from Grade 1-6
- **Theme Selection**: Visual theme selection with word counts
- **Real-time Updates**: Automatically fetches words when theme changes
- **Error Handling**: Graceful error handling with retry options
- **Loading States**: Visual feedback during API calls

## TypeScript Types

The system includes comprehensive TypeScript types in `src/types/learning-content.ts`:

- `Word`: Individual word with metadata
- `WordTheme`: Theme category
- `Grade`: Grade level
- `SentencePattern`: Sentence pattern with slots
- `PatternSlot`: Pattern blank definition
- API response types for all endpoints

## Usage Examples

### 1. Fetch Words for a Specific Theme
```typescript
const response = await fetch('/api/learning-content?action=words_by_theme&theme_id=1');
const data = await response.json();
const emotionWords = data.data; // Array of emotion words
```

### 2. Get Sentence Patterns for Grade 1
```typescript
const response = await fetch('/api/learning-content?action=sentence_patterns&grade_id=1');
const data = await response.json();
const patterns = data.data; // Array of sentence patterns with slots
```

### 3. Filter Words by Part of Speech
```typescript
const response = await fetch('/api/learning-content?action=words_by_theme&theme_id=2&part_of_speech=adjective');
const data = await response.json();
const colorAdjectives = data.data; // Only color adjectives
```

## Future Enhancements

1. **Image and Audio Integration**: Add support for word images and pronunciation audio
2. **Difficulty Levels**: Implement difficulty-based word filtering
3. **Progress Tracking**: Track student progress through different themes
4. **Custom Themes**: Allow teachers to create custom word themes
5. **Bulk Import**: Tools for importing large word lists
6. **Analytics**: Track word usage and learning patterns

## Troubleshooting

### Common Issues

1. **API Returns Empty Results**:
   - Check if the database schema is properly deployed
   - Verify the action parameter is correct
   - Check browser console for errors

2. **Database Connection Errors**:
   - Ensure D1 database is properly configured
   - Check wrangler.toml configuration
   - Verify database permissions

3. **Type Errors**:
   - Ensure TypeScript types are properly imported
   - Check for type mismatches in API responses

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
DEBUG=learning-content npm run dev
```

## Support

For technical support or questions about the Learning Content System, please refer to:
- API documentation in this file
- TypeScript type definitions
- Database schema file (`db/learning_content_schema.sql`)
- Deployment script (`scripts/deploy-d1-schema.sh`)
