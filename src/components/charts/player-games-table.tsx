import { mapGameNameToDisplay } from "@site/src/data/mapping"
import styles from "./base.module.css"

export default function({ games }) {
    return (<table>
        <thead>
            <tr>
                <th>Opponent</th>
                <th>Map Draft</th>
                <th>Civ Draft</th>
                <th>Map</th>
                <th>Player Civ</th>
                <th>Enemy civ</th>
                <th>Winner</th>
                <th>Duration</th>
            </tr>
        </thead>
        <tbody>
            {games.map(game => {
                return (
                    <tr key={game.set_id + game.map} className={game.winner ? styles.winner : styles.loser}>
                        <td>{game.opponent}</td>
                        <td><a href={`https://aoe2cm.net/draft/${game.map_draft}`} target="_blank">{game.map_draft}</a></td>
                        <td><a href={`https://aoe2cm.net/draft/${game.civ_draft}`} target="_blank">{game.civ_draft}</a></td>
                        <td>{mapGameNameToDisplay(game.map)}</td>
                        <td>
                            <a href={`https://aoe2techtree.net/#${game.civ}`} target="_blank">
                                <img src={`https://aoe2techtree.net/img/Civs/${game.civ.toLowerCase()}.png`} width="32" height="32" alt={game.civ} />
                            </a>
                        </td>
                        <td>
                            <a href={`https://aoe2techtree.net/#${game.opponent_civ}`} target="_blank">
                                <img src={`https://aoe2techtree.net/img/Civs/${game.opponent_civ.toLowerCase()}.png`} width="32" height="32" alt={game.opponent_civ} />
                            </a>
                        </td>
                        <td>{game.winner ? game.player : game.opponent}</td>
                        <td>{game.str_duration}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>)
}
