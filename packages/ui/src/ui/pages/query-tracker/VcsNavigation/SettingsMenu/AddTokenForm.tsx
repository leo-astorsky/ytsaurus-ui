import React, {FC, useState} from 'react';
import {SelectSingle} from '../../../../components/Select/Select';
import {Button, TextInput} from '@gravity-ui/uikit';
import {VcsType} from '../../module/repoNavigation/repoNavigationSlice';
import {saveToken} from '../../module/repoNavigation/actions';
import {useDispatch} from 'react-redux';
import cn from 'bem-cn-lite';
import './AddTokenForm.scss';

const block = cn('add-token-form');

const vcsList = Object.values(VcsType).map((value) => ({value}));

export const AddTokenForm: FC = () => {
    const dispatch = useDispatch();
    const [isSaving, setSaving] = useState(false);
    const [vcs, setVcs] = useState<string | undefined>();
    const [token, setToken] = useState('');

    const handleSave = async () => {
        if (vcs && token) {
            setSaving(true);
            await dispatch(saveToken(vcs as VcsType, token));
            setSaving(false);
            setVcs(undefined);
            setToken('');
        }
    };

    return (
        <div className={block()}>
            <SelectSingle
                items={vcsList}
                value={vcs}
                onChange={setVcs}
                hasClear
                placeholder="VCS"
            />
            <TextInput placeholder="token" value={token} onUpdate={setToken} hasClear />
            <Button view="action" onClick={handleSave} loading={isSaving}>
                Save
            </Button>
        </div>
    );
};
