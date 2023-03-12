import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

export default function App() {
  const firebaseConfig = {
    MYCONFIG;
  };

  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app);

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const saveItem = () => {
    if (product === '') {
      alert('Type in product first');
    } else if (amount === '') {
      alert('Type in amount first');
    } else {
      push(
        ref(database, 'items/'),
        { 'product': product, 'amount': amount }
      );
      setProduct('');
      setAmount('');
    }
  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        setList([]);
      } else {
        setList(Object.entries(data));
      }
    })
  }, []);


  const deleteItem = (id) => {
    remove(ref(database, `/items/${id}`));
  }


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textfield}
        onChangeText={currValue => setProduct(currValue)}
        value={product}
        placeholder='Product'
      />
      <TextInput
        style={styles.textfield}
        onChangeText={currValue => setAmount(currValue)}
        value={amount}
        placeholder='Amount'
      />
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={saveItem} title='Add' />
      </View>
      {list.length > 0 && <Text style={styles.header}>Shopping List:</Text>}
      <FlatList
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item[1].product}, {item[1].amount} </Text>
            <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item[0])}>Bought</Text>
          </View>
        }
        data={list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textfield:
  {
    height: 30,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    color: 'blue',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5
  },
  listcontainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  }
});
