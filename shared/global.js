import React from 'react';
import { Toast } from 'native-base';
import { _e } from './../lang';
export function showToast(text = '', type = 'danger', position = 'bottom') {
    Toast.show({
        text: (text == '') ? _e.connectionError : text,
        type: type,
        textStyle: {textAlign: 'center'},
        position: position,
        duration: 4000,
    });
}
