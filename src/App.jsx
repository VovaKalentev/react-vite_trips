import { useState , useEffect} from 'react'
//bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
//import FloatingLabel from 'react-bootstrap/FloatingLabel';
//
import axios from 'axios';
import Loader from './loader/Loader'
import './App.css'

//Смена формата даты на дд.мм.гггг
function ChangeDateFormat(date){
  const month = date.getMonth()+1;
  return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '.' + (month < 10 ? '0' + month : month) + '.' + date.getFullYear();
}

function App() {
  function getLastTrKey(){
    let tbody = document.querySelector("tbody");
    if(tbody != null){
      let allTr = tbody.querySelectorAll("tr");
      let lastIndex = allTr.length-1;
      let i = allTr[lastIndex].querySelector("td").innerText;
      return i;
    }
  }
  let rootBlock = document.getElementById("root");
  //Для модалки
  const [show, setShow] = useState(false);
  const HandleClose = () => setShow(false);
  const HandleShow = () => setShow(true);

  //Для таблицы
  const [loading, setLoading] = useState(true);
  const [data,setData] = useState(null);
  const [error, setError] = useState(null);

  //Для отправки данных с формы
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    // id: '',
    name: '',
    start: '',
    end: '',
    cities: '',
    distance: '',
    commentary: '',
    name_recipient: ''
  });
  function HandleChange(e){
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  async function HandleSubmit (e){
    e.preventDefault();
    setLoading(true);
    setMessage('Загрузка...');
    try {
    // Подготовка данных
    const data = {
      id: Number(getLastTrKey())+1,
      ...formData
    };
    
    // Отправка запроса
    const response = await fetch('https://script.google.com/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    // const response = await axios.post(
    //   'api/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec',
    //   data,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   }
    // );
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    setMessage(result.message);
    // Сброс формы
    setFormData({ /* ваши начальные значения */ });
    
  } catch (error) {
    setMessage(`Ошибка: ${error.message}`);
  } finally {
    setLoading(false);
  }
    // try {
    //   setFormData(prev => ({...prev,id:(getLastTrKey())}))
    //   console.table(formData);
    //   const response = await axios.post(
    //     'https://script.google.com/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Control-Check':'Access-Control-Allow-Origin'
    //       }
    //     }
    //   );
      
    //   setMessage(response.data.message);
    //   setFormData({
    //     id: '',
    //     name: '',
    //     start: '',
    //     end: '',
    //     cities: '',
    //     distance: '',
    //     commentary: '',
    //     name_recipient: ''
    //   });
    // } catch (error) {
    //   setMessage(error.response?.data?.message || 'Произошла ошибка при отправке данных');
    // } finally {
    //   setLoading(false);
    // }
  };
  //Запрос на вывод всех
  useEffect(()=>{
    const fetchData = async () => {
    try{
      setLoading(true);
      await fetch('https://script.google.com/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec')
      .then((res)=>res.json())
      .then((data)=>setData(data))
    }catch(err){
      setError(err instanceof Error ? err.message : 'Какаято ошибка');
    }finally {
      
      setLoading(false);
    }}
    fetchData();
  },[]);
  //Если данные еще не пришли идет лоадер
  if (loading) {
    rootBlock.classList.add("loaderCenter");
    return <Loader/>;
  }else{
    if(rootBlock.classList.contains('loaderCenter')){
      rootBlock.classList.remove("loaderCenter");
    }
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>Данные отсутствуют</div>;
  }
  return (
    <>
      <Table striped bordered hover >
        <thead>
          <tr>
            {/* <td>Номер</td> */}
            <td>Название комндировки</td>
            {/* <td>Начало</td>
            <td>Конец</td>
            <td>Города</td>
            <td>Расстояние</td>
            <td>Комментарий</td>
            <td>ФИО получателя</td> */}
            <td>Дата создания</td>
            <td>Статус</td>
          </tr>
        </thead>
        <tbody>
          {
            data &&
            data.map((item)=>{
              return (
              <tr key={item.id}>
                  <td hidden>{item.id}</td>
                  <td>{item.name}</td>
                  {/* <td>{ChangeDateFormat(new Date(item.start))}</td> */}
                  {/* <td>{ChangeDateFormat(new Date(item.end))}</td>
                  <td>{item.cities}</td>
                  <td>{item.distance}</td>
                  <td>{item.commentary}</td>
                  <td>{item.name_recipient}</td> */}
                  <td>{ChangeDateFormat(new Date(item.creation_date))}</td>
                  <td>Отправлено</td>
              </tr>)
            })
          }
        </tbody>
      </Table>
      <Button className='mt-5' variant="primary" onClick={HandleShow}>
        Добавить командировку
      </Button>
      <Modal
        show={show}
        onHide={HandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить командировку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action='https://script.google.com/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec' method='POST' >
            <Form.Group className="mb-3" hidden>
              <Form.Label>Название командировки</Form.Label>
              <Form.Control type="text" name="name" onChange={HandleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Название командировки</Form.Label>
              <Form.Control type="text" name="name" onChange={HandleChange} placeholder='ddd'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата начала</Form.Label>
              <Form.Control type="text" name="start" onChange={HandleChange} placeholder='12.02.2025'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата окончания</Form.Label>
              <Form.Control type="text" name="end" onChange={HandleChange} placeholder='13.02.2025'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Города</Form.Label>
              <Form.Control type="text" name="cities" onChange={HandleChange} placeholder='Город1, Город2'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Километраж</Form.Label>
              <Form.Control type="text" name="distance" onChange={HandleChange} placeholder='230'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control type="text" name="commentary" onChange={HandleChange} placeholder='Тест'/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ФИО получателя</Form.Label>
              <Form.Control type="text" name="name_recipient" onChange={HandleChange} placeholder='ФИО'/>
            </Form.Group>

            <Button variant="primary" type="submit">
              {loading ? 'Отправка...' : 'Отправить'}
            </Button>
          </Form>
        </Modal.Body> 
      </Modal>
      {message && <p>{message}</p>}
      {Number(getLastTrKey())+1}
    </>
  )
}
export default App

// <FloatingLabel
//   controlId="floatingInput"
//   label="Название командировки"
//   className="mb-3"
// >
//   <Form.Control type="text" placeholder='Название командировки'/>
// </FloatingLabel>