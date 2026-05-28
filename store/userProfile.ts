import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_NAME = "user_name";

export async function getUserName(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_NAME)) ?? "";
}

export async function saveUserName(name: string): Promise<void> {
  if (name.trim()) await AsyncStorage.setItem(KEY_NAME, name.trim());
}
