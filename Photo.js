import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList } from 'react-native'
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { Button} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'
import { HStack ,AppBar } from "@react-native-material/core";
var db = openDatabase({ name: 'Gallary.db' });
function Photo({ route, navigation }) {
  const [imag_path, UpdatePath] = useState([]);
  // const [Photo_uri, Setphoto_uri] = useState([]);
   const [images, setImages] = useState([]);
  // to open gallary to select multiple image 
  const openPicker = async () => {

    try {
      const responses = await MultipleImagePicker.openPicker({
        selectedAssets: images,
        mediaType: 'image',
        isExportThumbnail: true,
        usedCameraButton: true,
        isCrop: true,
        isCropCircle: true,
        maxSelectedAssets: 50,
      });
      console.log('size=',responses.length);

      for (let i = 0; i <responses.length; i++) {
        
        UpdatePath(prevState => [...prevState, responses[i].path])

      }
      console.log('images=>', imag_path);
    }
    catch (e) {
      console.log(e.code, e.message);
    }

    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Photo_Table'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Photo_Table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Photo_Table(Photo_name VARCHAR(300))',
              []
            );
          }
        }
      );
    })
    console.log('SQLite Database and Table Successfully Created...');

  };
  console.log('length',imag_path.length);

  const save=()=>{

    db.transaction((tx) => {

      for (let i = 0; i < imag_path.length; i++) {
         const item = imag_path[i];
       //  const itemString = JSON.stringify(item);
        tx.executeSql(
          'INSERT INTO Photo_Table (Photo_name) VALUES (?)',
          [item],
          (tx, results) => {
            console.log(`Inserted data with ID: `);
          },
          (tx, error) => {
            console.log(`Error inserting data:`);
          },
        );
      //  console.log('string',itemString);
      }

    });
    UpdatePath([]);
    
navigation.navigate("Home_Screen",{id:90});
  }


  return (

  
<>
    <AppBar title="SELECT PHOTO"  style={{backgroundColor:'blue'}}/>
      <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',flex:1}}>
      <Button title='Select ' onPress={openPicker} />
       <Button title='Save' onPress={save}></Button>
    
      </View>
     
      </>


  

  )
}
export default Photo