import { useState } from 'react';
import axios from 'axios';
import './App.css';

interface UserDetails {
  name: string;
  bio: string;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
}

interface Repo {
  name: string;
  url: string;
}   

type Repos= Repo[];

const App: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [userDetails, setUserDetails] = useState< UserDetails | null>(null);  
    const [repos, setRepos] = useState<Repos>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };
    const submitHandler = () => {
        axios.get(`https://api.github.com/users/${userName}`)
            .then(response => {
                setUserDetails(response.data);
            })
            .catch(error => {
                console.error("There was an error greeting the user!", error);
            }
        );  
    };

    const handleViewRepos = () => {
        if (userDetails) {  
            axios.get('https://api.github.com/users/' + userName + '/repos')
            .then(response => {
                setRepos(response.data);
            })
            .catch(error => {
                console.error("There was an error greeting the user!", error);
            }
        );
        }
    };

    return (
        <div>
            <h1 className='title'>GitHub Profile Viewer</h1>
           <input type="text" placeholder="Username..." onChange={handleInputChange} />
            <button className='fetch-btn' onClick={submitHandler}>Fetch</button>
            {userDetails && (
            <div className='user-details-card'>
                <h2 className='name'>{userDetails?.name}</h2> 
                <img className='avatar' src={userDetails?.avatar_url} alt="Avatar" style={{ width: '100px', height: '100px' }} />
                <div className='follow-info'>     
                    <p className='followers'>Followers: {userDetails?.followers}</p>     
                    <p className='following'>Following: {userDetails?.following}</p>
                </div>

                {userDetails?.public_repos>0 && (
                    <>
                    <p className='repo-count'>Repos: {userDetails?.public_repos}</p>
                    <button className='repo-btn' onClick={handleViewRepos}>View Repos</button>
                    </>
                )}
            </div>
            )}  

            {repos.length>0 && (
                <ul className='repo-list'>
                    <h3 className='repo-title'>Repositories:</h3>
                    {repos.map((repo, index) => (
                        <li key={index}>
                            <a className='repo-link' href={repo.url} target="_blank" rel="noopener noreferrer">
                                {repo.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;