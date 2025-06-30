import { useState , useEffect} from 'react'
//bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
//import FloatingLabel from 'react-bootstrap/FloatingLabel';
//
//import axios, { AxiosHeaders } from 'axios';
import Loader from './loader/Loader'
import './App.css'

//Смена формата даты на дд.мм.гггг
function ChangeDateFormat(date){
  const month = date.getMonth()+1;
  return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '.' + (month < 10 ? '0' + month : month) + '.' + date.getFullYear();
}

function App() {
  //Функция для определения последнего id для новой строки в таблице
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
    name: '',
    start: '',
    end: '',
    cities: '',
    distance: '',
    commentary: '',
    name_recipient: ''
  });
  //Данные сохраняются при вводе
  function HandleChange(e){
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //При отправки формы отправляется запрос на добавление
  async function HandleSubmit (e){
    e.preventDefault();
    setLoading(true);
    setMessage('Загрузка...');

    //!
    //Попытка обхода запрета POST на github pages
      // const data = {
      //   id: Number(getLastTrKey())+1,
      //   ...formData
      // };
    // const script = document.createElement('script');
    // script.src = `/api/macros/s/AKfycbyhFvwnAyfBXCB3HbvObZcrywLlia-KsA_BYbdntIQX2GzjWTHydFR9kTm60XiqHEQ/exec?${data.toString()}&callback=handleResponse`;
    // document.body.appendChild(script);
    //!

    //Попытка обхода запрета POST на github pages путем перехода на GET

    try {
      const i = Number(getLastTrKey()) + 1;
      const params = new URLSearchParams();
      
      // Добавляем все параметры вручную
      params.append('operation', 'addData');
      params.append('id', i.toString());
      Object.entries(formData).forEach(([key, value]) => {
        params.append(key, value || '');
      });

      setLoading(true);
      
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbywvkyQXqbAFVUiqYmQiEurVUbGzNnCKtPWuZD2r_YCCyDyEA0q3tXyDjknZcrhYhrC/exec?${params}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Unknown error from server');
      }

      setFormData({ /* сброс формы */ });
      
    } catch (error) {
      console.error('Ошибка:', error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
      HandleClose();
      location.reload();
    }
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
      }
    }
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
  }else{
    localStorage.setItem("nextIndex",Number(data[data.length-1].id)+1);
  }
  return (
    <>
      <Button className='mb-5' variant="primary" onClick={HandleShow}>
        Добавить командировку
      </Button>
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
          <Form onSubmit={HandleSubmit} >
            <Form.Group className="mb-3">
              <Form.Label>Название командировки</Form.Label>
              <Form.Control type="text" name="name" onChange={HandleChange} placeholder='ddd'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата начала</Form.Label>
              <Form.Control type="text" name="start" onChange={HandleChange} placeholder='12.02.2025'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата окончания</Form.Label>
              <Form.Control type="text" name="end" onChange={HandleChange} placeholder='13.02.2025'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Города</Form.Label>
              <Form.Control type="text" name="cities" onChange={HandleChange} placeholder='Город1, Город2'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Километраж</Form.Label>
              <Form.Control type="text" name="distance" onChange={HandleChange} placeholder='230'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control type="text" name="commentary" onChange={HandleChange} placeholder='Тест'required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ФИО получателя</Form.Label>
              <Form.Control type="text" name="name_recipient" onChange={HandleChange} placeholder='ФИО'required/>
            </Form.Group>

            <Button variant="primary" type="submit">
              {loading ? 'Отправка...' : 'Отправить'}
            </Button>
          </Form>
        </Modal.Body> 
      </Modal>
      {/* {message && <p>{message}</p>} */}
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