import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import RelationsInput from "../RelationsInput/RelationsInput";
import {InputsIndexed} from "./Hypotheses";
import {Inputs} from "../RelationsInputForm/RelationsInputForm";
import "./CheckboxList.css"

export default function CheckboxList(props: {
    inputsList: InputsIndexed[]
    changeInputsList: Function
    deleteFromList: Function
    unchecked: number[]
    setUnchecked: Function
}) {
    const handleToggle = (value: number) => () => {
        const currentIndex = props.unchecked.indexOf(value);
        const newChecked = [...props.unchecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        props.setUnchecked(newChecked);
    };

    return (
        <List sx={{ padding: '0px' }}>
            {props.inputsList.map((value) => {
                const labelId = `checkbox-list-label-${value.index}`;

                return (
                    <ListItem
                        key={value.index}
                        secondaryAction={
                            <IconButton edge="end"
                                        aria-label="comments"
                                        onClick={function(){props.deleteFromList(value.index)}}
                                        sx={{marginBottom: "15px"}}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemButton role={undefined}
                                        sx={{m: 0, p: 0}}
                        >
                            <ListItemIcon
                                sx = {{padding: "0px"}}
                            >
                                <Checkbox
                                    checked={props.unchecked.indexOf(value.index) === -1}
                                    onClick={handleToggle(value.index)}
                                    tabIndex={-1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    disableRipple
                                />
                            </ListItemIcon>
                        </ListItemButton>

                        <RelationsInput
                            inputs={value.inputs}
                            setInputs={
                                function(inputs: Inputs){
                                    props.changeInputsList(inputs, value.index);
                                }
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}
