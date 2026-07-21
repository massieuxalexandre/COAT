import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FlipClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const heures = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <View style={styles.clockContainer}>
      {/* HEURES */}
      <View style={styles.group}>
        <View style={styles.digits}>
          <FlipDigit value={heures[0]} />
          <FlipDigit value={heures[1]} />
        </View>
        <Text style={styles.label}>HEURES</Text>
      </View>

      {/* DEUX-POINTS */}
      <Text style={styles.separator}>:</Text>

      {/* MINUTES */}
      <View style={styles.group}>
        <View style={styles.digits}>
          <FlipDigit value={minutes[0]} />
          <FlipDigit value={minutes[1]} />
        </View>
        <Text style={styles.label}>MINUTES</Text>
      </View>
    </View>
  );
}

function FlipDigit({ value }: { value: string }) {
  return (
    <View style={styles.digit}>
      <Text style={styles.digitText}>{value}</Text>
      <View style={styles.middleLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  group: {
    alignItems: 'center',
  },
  digits: {
    flexDirection: 'row',
    gap: 4,
  },
  digit: {
    width: 65,
    height: 85,
    backgroundColor: '#a73c32',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  digitText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#F5F1E8',
    lineHeight: 75,
  },
  middleLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  separator: {
    fontSize: 50,
    fontWeight: '800',
    color: '#2A2420',
    marginHorizontal: 8,
    marginBottom: 22,
  },
  label: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#111111',
  },
});