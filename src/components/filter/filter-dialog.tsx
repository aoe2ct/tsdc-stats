import { useState } from 'react';
import styles from './filter-dialog.module.css'
import FilterMapItem from './filter-map-item';
import { pull, uniq, merge, cloneDeep } from 'lodash-es';
import FilterBracketItem from './filter-bracket-item';
import FilterStageItem from './filter-stage-item';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { BracketNameToImage, GameNameMappingToDisplayName, getBracketImage, loserStages, winnerStages } from '@site/src/data/mapping';

export type Filter = {
    maps: string[],
    brackets: string[],
    stages: string[],
    appliedFilters: {
        any: boolean,
        stages: boolean,
        brackets: boolean,
        maps: boolean,
    },
};

export default function FilterDialog(): JSX.Element {
    const onClickHandler = (isApplied) => {
        const dialog = document.getElementById('filter-dialog') as HTMLDialogElement;
        if (isApplied && typeof (window as any).setFilter === 'function') {
            (window as any).setFilter(filter);
        }
        dialog.close();
    };
    const defaultFilter: Filter = {
        maps: Object.keys(GameNameMappingToDisplayName),
        brackets: Object.keys(BracketNameToImage),
        stages: [...winnerStages],
        appliedFilters: {
            any: false,
            stages: false,
            brackets: false,
            maps: false,
        },
    };
    const [filter, setFilter] = useState(cloneDeep(defaultFilter));
    const onMapFilterChange = (mapname, value) => {
        const newSelectedMaps = value === false ? pull(filter.maps, mapname) : uniq(filter.maps.concat(mapname));
        setFilter(merge({}, filter, {
            maps: newSelectedMaps,
            appliedFilters: {
                maps: newSelectedMaps.length != defaultFilter.maps.length,
                any: filter.appliedFilters.stages || filter.appliedFilters.brackets || newSelectedMaps.length != defaultFilter.maps.length,
            },
        }));
    };
    const onBracketFilterChange = (bracketName, value) => {
        const newSelectedBrackets = value === false ? pull(filter.brackets, bracketName) : uniq(filter.brackets.concat(bracketName));
        setFilter(merge({}, filter, {
            brackets: newSelectedBrackets,
            appliedFilters: {
                brackets: newSelectedBrackets.length != defaultFilter.brackets.length,
                any: filter.appliedFilters.stages || newSelectedBrackets.length != defaultFilter.brackets.length || filter.appliedFilters.maps,
            },
        }));
    };
    const onStageFilterChange = (stageName, value) => {
        const newSelectedStages = value === false ? pull(filter.stages, stageName) : uniq(filter.stages.concat(stageName));
        setFilter(merge({}, filter, {
            stages: newSelectedStages,
            appliedFilters: {
                stages: newSelectedStages.length != defaultFilter.stages.length,
                any: newSelectedStages.length != defaultFilter.stages.length || filter.appliedFilters.brackets || filter.appliedFilters.maps,
            },
        }));
    };

    return (
        <dialog id="filter-dialog" className={styles['dialog']}>
            <h2>Maps</h2>
            <div className={styles['map-container']}>
                {Object.entries(GameNameMappingToDisplayName).map(([mapGameName, mapDisplayName]) =>
                    <FilterMapItem
                        key={mapGameName}
                        imageSrc={useBaseUrl(`/img/maps/${mapGameName.replace(/ /g, "_")}.png`)}
                        value={filter.maps.includes(mapGameName)}
                        onChange={onMapFilterChange.bind(this, mapGameName)}
                        name={mapDisplayName} />
                )}
            </div>
            <hr />
            <h2>Brackets</h2>
            <div className={styles['map-container']}>
                {Object.keys(BracketNameToImage).map((bracket) =>
                    <FilterBracketItem
                        key={bracket}
                        imageSrc={getBracketImage(bracket)}
                        value={filter.brackets.includes(bracket)}
                        onChange={onBracketFilterChange.bind(this, bracket)}
                        name={bracket} />
                )
                }
            </div>
            <hr />
            <h2>Stages</h2>
            <div className={styles['map-container']}>
                {[...winnerStages, ...loserStages].map(stage =>
                    <FilterStageItem
                        key={stage}
                        value={filter.stages.includes(stage)}
                        onChange={onStageFilterChange.bind(this, stage)}
                        name={stage} />
                )}
            </div>
            <hr />
            <div className={styles['action-container']}>
                <button onClick={onClickHandler.bind(this, true)} className={`${styles['action-btn']}`}>APPLY FILTERS</button>
                <button onClick={onClickHandler.bind(this, false)} className={`${styles['action-btn']}`}>CANCEL</button>
            </div>
        </dialog>
    );
}
