import {
  NOTES_CREATE_FAIL,
  NOTES_CREATE_REQUEST,
  NOTES_CREATE_SUCCESS,
  NOTES_DELETE_FAIL,
  NOTES_DELETE_REQUEST,
  NOTES_DELETE_SUCCESS,
  NOTES_LIST_FAIL,
  NOTES_LIST_REQUEST,
  NOTES_LIST_SUCCESS,
  NOTES_UPDATE_FAIL,
  NOTES_UPDATE_REQUEST,
  NOTES_UPDATE_SUCCESS,
} from "../constants/noteConstants";
import axios from "axios";

export const listNotes = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTES_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.token) {
      throw new Error("User not logged in or token missing");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/notes`, config);

    dispatch({
      type: NOTES_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: NOTES_LIST_FAIL,
      payload: message,
    });
  }
};

export const createNoteAction =
  (title, content, category) => async (dispatch, getState) => {
    try {
      dispatch({
        type: NOTES_CREATE_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/notes/create`,
        { title, content, category },
        config
      );

      dispatch({
        type: NOTES_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: NOTES_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteNoteAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTES_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/notes/${id}`, config);

    dispatch({
      type: NOTES_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: NOTES_DELETE_FAIL,
      payload: message,
    });
  }
};

export const updateNoteAction =
  (id, title, content, category, summarizedContent = null) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: NOTES_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Use summarizedContent if provided, else fallback to content
      const finalContent = summarizedContent || content;

      const { data } = await axios.put(
        `/notes/${id}`,
        { title, content: finalContent, category },
        config
      );
      console.log("Update Note Data:", data);

      dispatch({
        type: NOTES_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      dispatch({
        type: NOTES_UPDATE_FAIL,
        payload: message,
      });
    }
  };
