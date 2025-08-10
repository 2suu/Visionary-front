import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { checkId, ping } from '../api/health';

export default function TestScreen() {
  useEffect(() => {
    // 앱 시작 시 자동 실행
    ping().then(data => console.log('Ping result:', data));
  }, []);

  return (
    <View>
      <Button
        title="Check testuser ID"
        onPress={async () => {
          const result = await checkId('testuser');
          console.log('CheckId result:', result);
        }}
      />
    </View>
  );
}
