import { Link, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Compass } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Destination Not Found' }} />
      <View style={{ flex: 1, backgroundColor: colors.bg }} className="items-center justify-center p-6">
        <Compass size={44} color={colors.accent} />
        <Text style={{ color: colors.text }} className="text-xl font-bold mt-4">Destination Not Found</Text>
        <Text style={{ color: colors.textMuted }} className="text-xs text-center mt-2 max-w-xs leading-relaxed">
          The requested route does not exist in the AtlasLens navigation tree.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity
            style={{ backgroundColor: colors.accent }}
            className="mt-6 py-3 px-6 rounded-xl shadow-sm">
            <Text className="text-white font-bold text-sm">Return to Explore</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
