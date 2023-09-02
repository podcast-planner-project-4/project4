import sidebarImg from '../assets/sidebarImg.png';

const SideBar = ({walkDuration, handleWalkDurationChange}) => {

    return (

        <>
            <div className="sidebar wrapper">
                <h1>Podcast Planner</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit! Blah blah blah blah blah.
                </p>
                <div className="sidebarNav">
                    <label htmlFor='walkTime'>How long is your walk?</label>
                    {/* make it so the user cannot put a negative number */}
                    <input type='number' id='walkTime' value={walkDuration} onChange={()=>handleWalkDurationChange}>
                    </input>
                    <label htmlFor='genre'>Select your genre.</label>
                    <select id="genre">
                        <option value="">Please select</option>
                    </select>
                    <button className="submitBtn" class="type">Get List</button>
                </div>
                <img className="sidebarImg" src={sidebarImg}></img>
            </div>
        </>

    );

}

export default SideBar;