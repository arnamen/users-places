import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import useHttpClient from '../../shared/hooks/http-hook';

const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const request = async () => {
      try {
        const response = await sendRequest('http://127.0.0.1:5000/api/users/');
        setLoadedUsers(response);
      } catch (error) {
        //console.log(error)
      }
    }
    request();
    
    return () => {
    }
  }, [sendRequest])
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && <LoadingSpinner asOverlay/>}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers.users} />}
    </React.Fragment>
  
  );
};

export default Users;
