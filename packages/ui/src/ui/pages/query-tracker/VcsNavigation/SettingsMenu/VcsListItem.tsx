import React, {FC} from 'react';
import {VcsType} from '../../module/repoNavigation/repoNavigationSlice';
import Button from '../../../../components/Button/Button';
import {Icon} from '@gravity-ui/uikit';
import TrashBinIcon from '@gravity-ui/icons/svgs/trash-bin.svg';
import './VcsListItem.scss';
import cn from 'bem-cn-lite';

const block = cn('vcs-list-item');

type Props = {
    name: VcsType;
    onClick: (type: VcsType) => void;
};

export const VcsListItem: FC<Props> = ({name, onClick}) => {
    const [isSending, setIsSending] = React.useState(false);
    const handleOnClick = async () => {
        setIsSending(true);
        await onClick(name);
        setIsSending(false);
    };

    return (
        <div className={block()}>
            <span>{name}</span>{' '}
            <Button onClick={handleOnClick} view="flat" loading={isSending}>
                <Icon data={TrashBinIcon} size={16} />
            </Button>
        </div>
    );
};
