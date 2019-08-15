import React from 'react'
import { ImpulseSpinner } from 'react-spinners-kit'
import { theme } from '../../../theme'

const Loader: React.FunctionComponent = () => <ImpulseSpinner frontColor={theme.colors.green} backColor={theme.colors.lightGray}/>;

export default Loader
