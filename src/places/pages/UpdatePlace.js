import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import {AuthContext} from '../../shared/context/auth-context';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import './PlaceForm.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UpdatePlace = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    (async () => {
      try {
          const responseData = await sendRequest('http://127.0.0.1:5000/api/places/' + placeId);
          setLoadedPlace(responseData.place);
          setFormData(
            {
              title: {
                value: responseData.place.title,
                isValid: true
              },
              description: {
                value: responseData.place.description,
                isValid: true
              }
            },
            true
          );
      } catch (error) {
        //console.log(error)
      }
    }
    )()
    return () => {
      
    }
  }, [sendRequest, placeId, setFormData])

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(`http://127.0.0.1:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value
    }), {'Content-Type': 'application/json', authorization: 'Bearer ' + auth.token})

    history.push(`/${auth.userId}/places`)
    } catch (error) {
      //console.log(error)
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay/>
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;