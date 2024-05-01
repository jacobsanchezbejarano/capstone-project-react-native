import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.optionsContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          onPress={() => {
            onChange(index);
          }}
          style={ selections[index] ? styles.ordersOptionsSelected : styles.ordersOptions}>
          <View>
            <Text style={ selections[index] ? styles.ordersTextSelected : styles.ordersText}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  ordersOptions: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#EDEFEE',
    fontFamily: 'Karla-Regular',
    fontWeight: 'bold',
    borderRadius: 12,
  },
  ordersOptionsSelected: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#495e57',
    fontFamily: 'Karla-Regular',
    fontWeight: 'bold',
    borderRadius: 12,
  },
  ordersText: {
    color: '#495e57',
  },
  ordersTextSelected: {
    color: '#EDEFEE',
  }
});

export default Filters;
