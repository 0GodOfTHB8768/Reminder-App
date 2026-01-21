export interface NFLTheme {
  id: string;
  name: string;
  city: string;
  primary: string;      // Main team color
  secondary: string;    // Accent color
  primaryRgb: string;   // RGB for gradients
  secondaryRgb: string; // RGB for gradients
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
}

export const NFL_THEMES: NFLTheme[] = [
  // AFC East
  { id: 'bills', name: 'Bills', city: 'Buffalo', primary: '#00338D', secondary: '#C60C30', primaryRgb: '0, 51, 141', secondaryRgb: '198, 12, 48', conference: 'AFC', division: 'East' },
  { id: 'dolphins', name: 'Dolphins', city: 'Miami', primary: '#008E97', secondary: '#FC4C02', primaryRgb: '0, 142, 151', secondaryRgb: '252, 76, 2', conference: 'AFC', division: 'East' },
  { id: 'patriots', name: 'Patriots', city: 'New England', primary: '#002244', secondary: '#C60C30', primaryRgb: '0, 34, 68', secondaryRgb: '198, 12, 48', conference: 'AFC', division: 'East' },
  { id: 'jets', name: 'Jets', city: 'New York', primary: '#125740', secondary: '#FFFFFF', primaryRgb: '18, 87, 64', secondaryRgb: '255, 255, 255', conference: 'AFC', division: 'East' },

  // AFC North
  { id: 'ravens', name: 'Ravens', city: 'Baltimore', primary: '#241773', secondary: '#9E7C0C', primaryRgb: '36, 23, 115', secondaryRgb: '158, 124, 12', conference: 'AFC', division: 'North' },
  { id: 'bengals', name: 'Bengals', city: 'Cincinnati', primary: '#FB4F14', secondary: '#000000', primaryRgb: '251, 79, 20', secondaryRgb: '0, 0, 0', conference: 'AFC', division: 'North' },
  { id: 'browns', name: 'Browns', city: 'Cleveland', primary: '#311D00', secondary: '#FF3C00', primaryRgb: '49, 29, 0', secondaryRgb: '255, 60, 0', conference: 'AFC', division: 'North' },
  { id: 'steelers', name: 'Steelers', city: 'Pittsburgh', primary: '#101820', secondary: '#FFB612', primaryRgb: '16, 24, 32', secondaryRgb: '255, 182, 18', conference: 'AFC', division: 'North' },

  // AFC South
  { id: 'texans', name: 'Texans', city: 'Houston', primary: '#03202F', secondary: '#A71930', primaryRgb: '3, 32, 47', secondaryRgb: '167, 25, 48', conference: 'AFC', division: 'South' },
  { id: 'colts', name: 'Colts', city: 'Indianapolis', primary: '#002C5F', secondary: '#A2AAAD', primaryRgb: '0, 44, 95', secondaryRgb: '162, 170, 173', conference: 'AFC', division: 'South' },
  { id: 'jaguars', name: 'Jaguars', city: 'Jacksonville', primary: '#006778', secondary: '#D7A22A', primaryRgb: '0, 103, 120', secondaryRgb: '215, 162, 42', conference: 'AFC', division: 'South' },
  { id: 'titans', name: 'Titans', city: 'Tennessee', primary: '#0C2340', secondary: '#4B92DB', primaryRgb: '12, 35, 64', secondaryRgb: '75, 146, 219', conference: 'AFC', division: 'South' },

  // AFC West
  { id: 'broncos', name: 'Broncos', city: 'Denver', primary: '#FB4F14', secondary: '#002244', primaryRgb: '251, 79, 20', secondaryRgb: '0, 34, 68', conference: 'AFC', division: 'West' },
  { id: 'chiefs', name: 'Chiefs', city: 'Kansas City', primary: '#E31837', secondary: '#FFB81C', primaryRgb: '227, 24, 55', secondaryRgb: '255, 184, 28', conference: 'AFC', division: 'West' },
  { id: 'raiders', name: 'Raiders', city: 'Las Vegas', primary: '#000000', secondary: '#A5ACAF', primaryRgb: '0, 0, 0', secondaryRgb: '165, 172, 175', conference: 'AFC', division: 'West' },
  { id: 'chargers', name: 'Chargers', city: 'Los Angeles', primary: '#002A5E', secondary: '#FFC20E', primaryRgb: '0, 42, 94', secondaryRgb: '255, 194, 14', conference: 'AFC', division: 'West' },

  // NFC East
  { id: 'cowboys', name: 'Cowboys', city: 'Dallas', primary: '#003594', secondary: '#869397', primaryRgb: '0, 53, 148', secondaryRgb: '134, 147, 151', conference: 'NFC', division: 'East' },
  { id: 'giants', name: 'Giants', city: 'New York', primary: '#0B2265', secondary: '#A71930', primaryRgb: '11, 34, 101', secondaryRgb: '167, 25, 48', conference: 'NFC', division: 'East' },
  { id: 'eagles', name: 'Eagles', city: 'Philadelphia', primary: '#004C54', secondary: '#A5ACAF', primaryRgb: '0, 76, 84', secondaryRgb: '165, 172, 175', conference: 'NFC', division: 'East' },
  { id: 'commanders', name: 'Commanders', city: 'Washington', primary: '#773141', secondary: '#FFB612', primaryRgb: '119, 49, 65', secondaryRgb: '255, 182, 18', conference: 'NFC', division: 'East' },

  // NFC North
  { id: 'bears', name: 'Bears', city: 'Chicago', primary: '#0B162A', secondary: '#C83803', primaryRgb: '11, 22, 42', secondaryRgb: '200, 56, 3', conference: 'NFC', division: 'North' },
  { id: 'lions', name: 'Lions', city: 'Detroit', primary: '#0076B6', secondary: '#B0B7BC', primaryRgb: '0, 118, 182', secondaryRgb: '176, 183, 188', conference: 'NFC', division: 'North' },
  { id: 'packers', name: 'Packers', city: 'Green Bay', primary: '#183028', secondary: '#FFB81C', primaryRgb: '24, 48, 40', secondaryRgb: '255, 184, 28', conference: 'NFC', division: 'North' },
  { id: 'vikings', name: 'Vikings', city: 'Minnesota', primary: '#4F2683', secondary: '#FFC62F', primaryRgb: '79, 38, 131', secondaryRgb: '255, 198, 47', conference: 'NFC', division: 'North' },

  // NFC South
  { id: 'falcons', name: 'Falcons', city: 'Atlanta', primary: '#A71930', secondary: '#000000', primaryRgb: '167, 25, 48', secondaryRgb: '0, 0, 0', conference: 'NFC', division: 'South' },
  { id: 'panthers', name: 'Panthers', city: 'Carolina', primary: '#0085CA', secondary: '#101820', primaryRgb: '0, 133, 202', secondaryRgb: '16, 24, 32', conference: 'NFC', division: 'South' },
  { id: 'saints', name: 'Saints', city: 'New Orleans', primary: '#101820', secondary: '#D3BC8D', primaryRgb: '16, 24, 32', secondaryRgb: '211, 188, 141', conference: 'NFC', division: 'South' },
  { id: 'buccaneers', name: 'Buccaneers', city: 'Tampa Bay', primary: '#D50A0A', secondary: '#34302B', primaryRgb: '213, 10, 10', secondaryRgb: '52, 48, 43', conference: 'NFC', division: 'South' },

  // NFC West
  { id: 'cardinals', name: 'Cardinals', city: 'Arizona', primary: '#97233F', secondary: '#000000', primaryRgb: '151, 35, 63', secondaryRgb: '0, 0, 0', conference: 'NFC', division: 'West' },
  { id: 'rams', name: 'Rams', city: 'Los Angeles', primary: '#003594', secondary: '#FFD100', primaryRgb: '0, 53, 148', secondaryRgb: '255, 209, 0', conference: 'NFC', division: 'West' },
  { id: '49ers', name: '49ers', city: 'San Francisco', primary: '#AA0000', secondary: '#B3995D', primaryRgb: '170, 0, 0', secondaryRgb: '179, 153, 93', conference: 'NFC', division: 'West' },
  { id: 'seahawks', name: 'Seahawks', city: 'Seattle', primary: '#002244', secondary: '#69BE28', primaryRgb: '0, 34, 68', secondaryRgb: '105, 190, 40', conference: 'NFC', division: 'West' },
];

export const DEFAULT_THEME = NFL_THEMES.find(t => t.id === 'packers')!;

export function getThemeById(id: string): NFLTheme {
  return NFL_THEMES.find(t => t.id === id) || DEFAULT_THEME;
}

// Group themes by division for easier display
export function getThemesByConference(): Record<string, Record<string, NFLTheme[]>> {
  const grouped: Record<string, Record<string, NFLTheme[]>> = {
    AFC: { East: [], North: [], South: [], West: [] },
    NFC: { East: [], North: [], South: [], West: [] },
  };

  NFL_THEMES.forEach(theme => {
    grouped[theme.conference][theme.division].push(theme);
  });

  return grouped;
}
