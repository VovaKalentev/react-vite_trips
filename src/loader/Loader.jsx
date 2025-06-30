import Spinner from 'react-bootstrap/Spinner';

function Loader() {
return (
  <>
    <div className='flex w-full h-full justify-center align-center'>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  </>
)
}

export default Loader