import { Box, Button, Grid, Typography } from '@mui/material';
import Page from 'components/Page';
import MHidden from 'components/@material-extend/MHidden';
import { useEffect, useLayoutEffect, useState } from 'react';
import apis from 'services';
import { useLocation } from 'react-router-dom';
import { getNetworkImage, getNetworkSymbol } from 'utils/networkSymbol';
import { useSelector } from 'redux/store';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { displayFollowers, formattedDate, imageURL, isValidImage } from '../utils';
import { useIDOContract, usePoolContract } from 'hooks/useContract';
import { useStakingContract, useTokenContract } from '../hooks/useContract';
import useGetBnbBalance from 'hooks/useTokenBalance';
import { formatUnits, parseUnits, formatEther, parseEther } from '@ethersproject/units';
import { atcb_action } from 'add-to-calendar-button';
import 'add-to-calendar-button/assets/css/atcb.css';
import { number } from 'yup';

export default function ProjectDetail(props) {
  const { chainId = 0 } = useSelector((store) => store.network);

  const { pathname, hash } = useLocation();

  const tokenAddress = pathname.split('/')[pathname.split('/').length - 1];
  const [data, setData] = useState([]);
  const [randomImages, setRandomImages] = useState([imageURL('avatar1.png'), imageURL('avatar2.png'), imageURL('avatar3.png')]);

  const { name = '', description, startDateTime, endDateTime } = data;
  const handleGoogleCalander = (e) => {
    e.stopPropagation();
    atcb_action({
      name: name,
      description: description,
      startDate: startDateTime,
      endDate: endDateTime,
      options: ['Google'],
      timeZone: 'Europe/Berlin'
    });
  };

  useEffect(() => {
    (async () => {
      const response = await apis.getProjectDetails(tokenAddress, {});
      if (response.statusText === 'OK') {
        const { pool } = response.data;
        setData(pool);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await apis.getRandomImages();
      if (response?.status !== 200) return;
      const images = response?.data?.results?.length > 0 ? response.data?.results.map(result => result.picture.thumbnail) : [];
      setRandomImages(images);
    })();
  }, []);

  useEffect(() => {
    document.querySelector('.css-hsfvqa').style.overflow = 'visible';
    document.querySelector('.css-om7vnx').style.overflow = 'visible';
  }, []);

  useLayoutEffect(() => {

    setTimeout(() => {
      const pos = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({ top: (pos - 300) });
    }, 200);

    // setTimeout(( ) => {
    //   const pos = window.pageYOffset || document.documentElement.scrollTop;
    //   window.scrollTo({top: (pos - 300)});
    // }, 300)
  }, [hash]);

  /*useEffect(() => {
    console.log('#########', hash);


    setTimeout(( ) => {
      const pos = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({top: (pos - 300)});
    }, 300)


  }, [hash]);*/





  return (
    <>
      <Page style={{ backgroundColor: '#171819' }}>
        <MHidden width='mdDown'>
          <Grid paddingLeft='13%' paddingRight='13%'>
            <Grid container spacing={1} paddingTop='30px'>
              <Grid item sm={3}>
                <CustomCard name='Token Price' number={`${Number(1 / data?.presaleRate) || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item sm={3}>
                <CustomCard name='Soft Cap' number={`${data?.softCap || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item sm={3}>
                <CustomCard name='Hard Cap' number={`${data?.hardCap || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item sm={3}>
                <CustomCard name='Type' number={data?.type}></CustomCard>
              </Grid>
            </Grid>
            <Grid marginTop='30px'>
              <Detail data={data}></Detail>
            </Grid>

            {/* Follower */}
            {/* <Typography marginTop='30px' style={{ fontSize: '34px', fontFamily: 'Segoe UI', color: '#56C5FF' }}>
              {displayFollowers(data?.twitter_followers)} Followers
            </Typography>
            <Grid container direction='row' spacing={1} marginTop='10px'>
              {randomImages.map((image, idx) => <Grid item key={idx}>
                <Box component='img' src={image} borderRadius={'50%'} />
              </Grid>)}
            </Grid> */}


            <Grid marginTop='30px' container direction='row' spacing={1}>
              {/* <Grid item>
                <Button
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Segoe UI',
                    fontSize: '14px',
                    color: 'white',
                    padding: '10px 20px 10px 20px',
                    textTransform: 'lowercase'
                  }}
                >
                  <Box component='img' src={imageURL('Vector.png')} mr={1} />
                  whitepaper
                </Button>
              </Grid> */}
              <Grid item>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.website}`} target='_blank'>
                    <Box component='img' src={imageURL('Vector_www.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.telegram}`} target='_blank'>
                    <Box component='img' src={imageURL('plane_avatar.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.twitter}`} target='_blank'>
                    <Box component='img' src={imageURL('twitter_avatar.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.discord}`} target='_blank'>
                    <Box component='img' src={imageURL('Discord.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item alignItems='center' display='flex'>
                {/* <Box component="a" href="#" color="white">
                  Add To Google Calendar
                </Box> */}
                <Box component='a' color='white' sx={{ cursor: 'pointer' }} onClick={handleGoogleCalander}>
                  Add to Google Calendar
                </Box>
              </Grid>
            </Grid>
            <Grid marginTop='50px'>
              <ProjectInformation data={data}></ProjectInformation>
            </Grid>
            {/* <Grid marginTop="60px" justifyContent="center" display="flex">
              <Box component="img" src={imageURL('roadmap-icon.png')}></Box>
            </Grid> */}
            <div id='sticky' style={{ position: 'sticky', top: '92px', backgroundColor: 'rgb(23, 24, 25)' }}>
              <Grid container marginTop='60px' justifyContent='center' sx={{ width: '113%' }}>
                <Grid item xs position='relative'>

                  <Box component='div' width={'50%'}>
                    <Box component={'a'} href='#roadmap'>
                      <img src={imageURL('roadmap-icon-1.png')} />
                    </Box>
                  </Box>
                  <Box
                    component={'span'}
                    sx={{
                      position: 'absolute',
                      top: '30%',
                      width: '52%',
                      height: '4px',
                      background: '#56c4ff',
                      right: -1
                    }}
                  ></Box>
                  {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
                </Grid>
                <Grid item xs position='relative'>

                  <Box component='div' width={'50%'}>
                    <Box component={'a'} href='#about'>
                      <img src={imageURL('roadmap-icon-2.png')} />
                    </Box>
                  </Box>
                  <Box
                    component={'span'}
                    sx={{
                      position: 'absolute',
                      top: '30%',
                      width: '52%',
                      height: '4px',
                      background: '#56c4ff',
                      right: -1
                    }}
                  ></Box>
                  {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
                </Grid>
                <Grid item xs position='relative'>

                  <Box component='div' width={'50%'}>
                    <Box component={'a'} href='#features'>
                      <img src={imageURL('roadmap-icon-3.png')} />
                    </Box>
                  </Box>
                  <Box
                    component={'span'}
                    sx={{
                      position: 'absolute',
                      top: '30%',
                      width: '52%',
                      height: '4px',
                      background: '#56c4ff',
                      right: -1
                    }}
                  ></Box>
                  {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
                </Grid>
                <Grid item xs position='relative'>

                  <Box component='div' width={'50%'}>
                    <Box component={'a'} href='#team'>
                      <img src={imageURL('roadmap-icon-4.png')} />
                    </Box>
                  </Box>
                  <Box
                    component={'span'}
                    sx={{
                      position: 'absolute',
                      top: '30%',
                      width: '52%',
                      height: '4px',
                      background: '#56c4ff',
                      right: -1
                    }}
                  ></Box>
                  {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
                </Grid>
                <Grid item xs position='relative'>

                  <Box component='div' width={'50%'}>
                    <Box component={'a'} href='#tokenomics'>
                      <img src={imageURL('roadmap-icon-5.png')} />
                    </Box>
                  </Box>
                  {/* <Box
                  component={'span'}
                  sx={{
                    position: 'absolute',
                    top: '34%',
                    width: '52%',
                    height: '4px',
                    background: '#56c4ff',
                    right: 0
                  }}
                ></Box> */}
                  {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
                </Grid>
              </Grid>
            </div>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Roadmap'}
                id='roadmap'
                description={data?.roadmap_description}
                description_url={data?.roadmap_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'About'}
                id='about'
                description={data?.about_description}
                description_url={data?.about_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Features'}
                id='features'
                description={data?.features_description}
                description_url={data?.features_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Team'}
                id='team'
                description={data?.teams_description}
                description_url={data?.teams_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Tokenomics'}
                id='tokenomics'
                description={data?.tokenomics_description}
                description_url={data?.tokenomics_url}
              ></Roadmap>
            </Grid>
          </Grid>
        </MHidden>

        <MHidden width='mdUp'>
          <Grid paddingLeft='5%' paddingRight='5%'>
            <Grid container spacing={1} paddingTop='30px'>
              <Grid item xs={6}>
                <CustomCard name='Token Price' number={`${Number(1 / data?.presaleRate) || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item xs={6}>
                <CustomCard name='Soft Cap' number={`${data?.softCap || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item xs={6}>
                <CustomCard name='Hard Cap' number={`${data?.hardCap || 0} ${getNetworkSymbol(chainId)}`}></CustomCard>
              </Grid>
              <Grid item xs={6}>
                <CustomCard name='Type' number={data?.type}></CustomCard>
              </Grid>
            </Grid>
            <Grid marginTop='30px'>
              <Detail data={data}></Detail>
            </Grid>


            {/* Followers */}
            {/* <Grid display='flex' justifyContent='center'>
              <Typography marginTop='30px' style={{ fontSize: '20px', fontFamily: 'Segoe UI', color: '#56C5FF' }}>
                {displayFollowers(data?.twitter_followers)} Followers
              </Typography>
            </Grid>
            <Grid container direction='row' spacing={1} marginTop='10px' display='flex' justifyContent='center'>
              <Grid item>
                <Box component='img' src={imageURL('avatar1.png')} />
              </Grid>
              <Grid item>
                <Box component='img' src={imageURL('avatar2.png')} />
              </Grid>
              <Grid item>
                <Box component='img' src={imageURL('avatar3.png')} />
              </Grid>
            </Grid> */}


            <Grid
              marginTop='30px'
              container
              direction='row'
              spacing={1}
              padding='0px 15px'
              display='flex'
              justifyContent='space-around'
            >
              {/* <Grid item xs={12}>
                <Button
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Segoe UI',
                    fontSize: '14px',
                    color: 'white',
                    padding: '10px 20px 10px 20px',
                    width: '100%',
                    textTransform: 'lowercase'
                  }}
                >
                  <Box component='img' marginRight='8px' src={imageURL('Vector.png')} />
                  whitepaper
                </Button>
              </Grid> */}
              <Grid item marginTop='20px'>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.website}`} target="_blank">
                    <Box component='img' src={imageURL('Vector_www.png')} />
                  </Box>
                </Box>
              </Grid>

              <Grid item marginTop='20px'>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.telegram}`} target="_blank">
                    <Box component='img' src={imageURL('plane_avatar.png')} />
                  </Box>
                </Box>
              </Grid>

              <Grid item marginTop='20px'>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >
                  <Box component='a' href={`${data?.ipfs?.twitter}`} target="_blank">
                    <Box component='img' src={imageURL('twitter_avatar.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item marginTop='20px'>
                <Box
                  component='button'
                  style={{
                    height: '44px',
                    border: 'none',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 10px 10px 10px'
                  }}
                >

                  <Box component='a' href={`${data?.ipfs?.discord}`} target="_blank">
                    <Box component='img' src={imageURL('Discord.png')} />
                  </Box>
                </Box>
              </Grid>
              <Grid item alignItems='center' display='flex' marginTop='15px'>
                <Box component='a' color='white' sx={{ cursor: 'pointer' }} onClick={handleGoogleCalander}>
                  Add To Google Calendar
                </Box>
              </Grid>
            </Grid>
            <Grid marginTop='50px'>
              <ProjectInformation data={data}></ProjectInformation>
            </Grid>
            <Grid container marginTop='60px' justifyContent='center' display='flex'>
              <Grid item xs={2.4} position='relative'>

                <Box component='div' width={'50%'}>
                  <Box component={'a'} href='#roadmap'>
                    <img src={imageURL('roadmap-icon-1.png')} />
                  </Box>
                </Box>
                <Box
                  component={'span'}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    width: '52%',
                    height: '4px',
                    background: '#56c4ff',
                    right: -1
                  }}
                ></Box>
                {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
              </Grid>
              <Grid item xs={2.4} position='relative'>

                <Box component='div' width={'50%'}>
                  <Box component={'a'} href='#about'>
                    <img src={imageURL('roadmap-icon-2.png')} />
                  </Box>
                </Box>
                <Box
                  component={'span'}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    width: '52%',
                    height: '4px',
                    background: '#56c4ff',
                    right: -1
                  }}
                ></Box>
                {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
              </Grid>
              <Grid item xs={2.4} position='relative'>

                <Box component='div' width={'50%'}>
                  <Box component={'a'} href='#features'>
                    <img src={imageURL('roadmap-icon-3.png')} />
                  </Box>
                </Box>
                <Box
                  component={'span'}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    width: '52%',
                    height: '4px',
                    background: '#56c4ff',
                    right: -1
                  }}
                ></Box>
                {/* <img src={imageURL('roadmap-icon-line.png')} /> */}
              </Grid>
              <Grid item xs={2.4} position='relative'>

                <Box component='div' width={'50%'}>
                  <Box component={'a'} href='#team'>
                    <img src={imageURL('roadmap-icon-4.png')} />
                  </Box>
                </Box>
                <Box
                  component={'span'}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    width: '52%',
                    height: '4px',
                    background: '#56c4ff',
                    right: -1
                  }}
                ></Box>
              </Grid>
              <Grid item xs={2.4} position='relative'>
                <Box component='div' width={'50%'}>
                  <Box component={'a'} href='#tokenomics'>
                    <img src={imageURL('roadmap-icon-5.png')} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid item marginTop='50px'>
              <Roadmap
                title={'Roadmap'}
                id='roadmap'
                description={data?.roadmap_description}
                description_url={data?.roadmap_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'About'}
                id='about'
                description={data?.about_description}
                description_url={data?.about_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Features'}
                id='features'
                description={data?.features_description}
                description_url={data?.features_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Team'}
                id='team'
                description={data?.teams_description}
                description_url={data?.teams_url}
              ></Roadmap>
            </Grid>
            <Grid marginTop='50px'>
              <Roadmap
                title={'Tokenomics'}
                id='tokenomics'
                description={data?.tokenomics_description}
                description_url={data?.tokenomics_url}
              ></Roadmap>
            </Grid>
          </Grid>
        </MHidden>
      </Page>
    </>
  );
}

function CustomCard(props) {
  return (
    <>
      <MHidden width='mdDown'>
        <Grid style={{ backgroundColor: '#232323', borderRadius: 10, padding: '20px' }}>
          <Box style={{ fontSize: '15px', color: '#24B6E6' }}>{props.projectName}</Box>
          <Box marginTop='20px' style={{ fontSize: '20px', color: 'white' }}>
            {props.number}
          </Box>
        </Grid>
      </MHidden>
      <MHidden width='mdUp'>
        <Grid style={{ backgroundColor: '#232323', borderRadius: 10, padding: '20px' }}>
          <Box style={{ fontSize: '15px', color: '#24B6E6' }} textAlign='center'>
            {props.name}
          </Box>
          <Box marginTop='10px' style={{ fontSize: '20px', color: 'white' }} textAlign='center'>
            {props.number}
          </Box>
        </Grid>
      </MHidden>
    </>
  );
}

function ProjectInformation({ data: poolInfo, roadmapdata }) {
  const chainId = useSelector((store) => store.network.chainId);
  const { account, library } = useActiveWeb3React();
  const [approved, setApproved] = useState(false); //user approving status
  const [buyCondition, setBuyCondition] = useState(false); //condition for user buying
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const idoContract = useIDOContract();
  const poolContract = usePoolContract(poolInfo?.address);

  useEffect(() => {
    (async () => {
      if (account && poolInfo) {
        var shouldBeWhitelisted = !poolInfo?.whitelistable || poolInfo?.whiteLists?.includes(account); // if pool is public or account is whitelisted, user can buy token
        console.log('wowwowoowow', approved, shouldBeWhitelisted, approved & shouldBeWhitelisted)
        setBuyCondition(approved & shouldBeWhitelisted);
      }
    })();
  }, [account, poolInfo, approved]);

  //approved

  const [numberofApproving, setNumberofApproving] = useState(0); //number of pool approvings
  useEffect(() => {
    (async () => {
      try {
        const response = await apis.getApproval({
          pool_address: poolInfo.address,
          user_address: account
        });
        if (response.data.result) {
          setApproved(response.data.data)
        }
        else {
          alert(response.data.message)
        }
      } catch (error) {
        console.log(error.message)
      }
    })();

    //count approval
    (async () => {
      try {
        const response = await apis.countApproval({
          pool_address: poolInfo.address
        });
        if (response.data.result) {
          setNumberofApproving(response.data.data)
        }
        else {
          alert(response.data.message)
        }
      } catch (error) {
        console.log(error.message)
      }
    })();
  }, [account, poolInfo]);

  //max allocation 
  const [maxAllocationHere, setmaxAllocationhere] = useState(0);
  useEffect(() => {
    if (poolInfo && started && numberofApproving > 0)
      if (numberofApproving > 0) setmaxAllocationhere(Number(poolInfo?.hardCap) / Number(numberofApproving))

  }, [started, poolInfo, numberofApproving])


  //Wallet token balance
  const [tokenBalance, setTokenBalance] = useState(0);
  useEffect(() => {
    (async () => {
      if (account) {
        try {
          /** Get token balance */
          // const wallet_balance = await tokenContract.balanceOf(account);
          // const decimals = await tokenContract.decimals();
          // let tokenBalance = formatUnits(wallet_balance, decimals)
          // setTokenBalance(tokenBalance)

          /** Get native token balance */
          let balance = await library.getBalance(account)
          setTokenBalance(formatUnits(balance, 18))
        } catch (error) {
          console.log(error.message)
        }
      }
    })();
  }, [account, poolInfo])



  //
  const [buyingAmount, setBuyingAmount] = useState(0);

  //my contribution
  const [myCollaboration, setMyCollaboration] = useState(0);
  useEffect(() => {
    (async () => {
      if (account && poolContract) {
        try {
          let value = await poolContract.collaborations(account)
          console.log('myCollaboration', formatEther(value))
          setMyCollaboration(formatEther(value))
        } catch (error) {
          console.log(error.message)
        }
      }
    })();
  }, [account, poolInfo])

  //buy function
  const buy = async () => {
    try {
      if (buyingAmount < poolInfo.minAllocationPerUser) {
        alert('Should be greater than min allocation');
        return;
      }
      if (buyingAmount > maxAllocationHere) {
        alert('Should be less than max allocation');
        return;
      }

      console.log(parseEther(String(buyingAmount)))
      const tx = await idoContract.deposit(poolInfo?.address, {
        value: parseEther(String(buyingAmount))
      });
      await tx.wait();

      const collaborated = await poolContract.collaborations(account);
      setMyCollaboration(formatEther(collaborated));

      var value = await poolContract._weiRaised()
      setEtherRaised(formatEther(value))
      await apis.updateIDOWeiRaised({
        address: poolInfo?.address,
        weiRaised: formatEther(value)
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  const preapprove = async () => {
    try {
      const response = await apis.setApproval({
        pool_address: poolInfo.address,
        user_address: account
      });
      if (response.data.result) {
        alert('success');
        window.location.reload()
      }
      else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => { //IDO Contract is working well
    (async () => {
      if (idoContract) {
        try {
          // var value = await idoContract.poolFixedFee(0)
          // console.log('poolFixedFee', value)    

          // var value = await idoContract.poolPercentFee()
          // console.log('poolPercentFee', value)    

          var value = await idoContract.poolAddresses(0)
          console.log('poolAddresses', value)

          // var value = await idoContract.poolOwners('0x9d6CF01e8f4De8bEF944d05458C5E704F7668A08')
          // console.log('poolOwners', value)       
        } catch (error) {
          console.log(error.message)
        }
      }
    })();
  }, [idoContract])


  const [etherRaised, setEtherRaised] = useState(0);
  useEffect(() => { //pool contract is working well
    (async () => {
      if (poolContract) {
        try {

          var value = await poolContract.poolDetails()
          console.log('poolDetails', value)

          var value = await poolContract._weiRaised()
          setEtherRaised(formatEther(value))
          console.log('_weiRaised', value)
        } catch (error) {
          console.log(error.message)
        }
      }
    })();
  }, [poolContract])


  //started, ended
  const [remainingHours, setRemainingHours] = useState(0);
  useEffect(() => {
    var startingTime = new Date(poolInfo.startDateTime).getTime()
    var endingTime = new Date(poolInfo.endDateTime).getTime()
    var nowTime = Date.now();
    console.log(startingTime, nowTime)
    if (startingTime > nowTime) {
      setStarted(false);
      var diff = startingTime - nowTime;
      setRemainingHours(Math.ceil(diff / 60 / 60 / 1000))
    }
    else setStarted(true)

    if (nowTime > endingTime) {
      setEnded(true);
    } else {
      setEnded(false)
    }
  }, [poolInfo])

  //staking staus
  const [stakingamount, setStakingAmount] = useState(true); //user staking status, it is condition for user approving
  const stakingContract = useStakingContract('0x28847a4C42D11E56b15BBA2Bb619889F4b3a97EC'); //MGV token
  useEffect(() => {
    (async () => {
      const staked = await stakingContract.balances(account);
      setStakingAmount(Number(formatEther(staked)))
    })();
  }, [account, stakingContract])

  const handleFinalize = async () => {
    try {
      const tx = await idoContract.endPool(poolInfo?.address);
      await tx.wait();
      console.log('Successfully Finalized!', {
        variant: 'success'
      });
    } catch (err) {
      console.log(err?.message);
      if (err?.data?.message?.includes(`already existed!`) || err?.message?.includes(`already existed!`))
        console.log('Already listed on DEX!', {
          variant: 'error'
        });
      else if (err?.data?.message?.includes(`not finalized!`) || err?.message?.includes(`not finalized!`))
        console.log('Not ready to finalize the pool!', {
          variant: 'error'
        });
      else if (err?.data?.message?.includes(`remove tax`) || err?.message?.includes(`remove tax`))
        console.log('You should remove the tax for the IDO and Presale address! Check Docs', {
          variant: 'error'
        });
      else
        console.log('Oops, Something went wrong, Failed in Finalizing!', {
          variant: 'error'
        });
    }
  }

  return (
    <>
      {/* Desktop view */}
      <MHidden width='mdDown'>
        <Grid container border='1px solid #56C5FF' borderRadius={1} bgcolor='#232323' padding='30px' rowSpacing={2}>
          <Grid item sm={7} color='#56C5FF' fontSize={48}>
            Project Information
          </Grid>
          <Grid item sm={5} color='#56C5FF' fontSize={48}>
            Token Information
          </Grid>
          <Grid container direction='row'>
            <Grid item sm={2} >
              <Grid item color='white'>
                HARDCAP
              </Grid>
              <Grid item color='white'>
                OPEN TIME
              </Grid>
              <Grid item color='white'>
                CLOSE TIME
              </Grid>
              <Grid item color='white'>
                LISTING DATE
              </Grid>
              <Grid item color='white'>
                DEAL
              </Grid>
            </Grid>
            <Grid item sm={3} >
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.hardCap} {getNetworkSymbol(chainId)}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {formattedDate(poolInfo?.startDateTime)}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {formattedDate(poolInfo?.endDateTime)}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {formattedDate(poolInfo?.listDateTime)}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.deal}
              </Grid>
            </Grid>
            <Grid item sm={2}></Grid>
            <Grid item sm={2} >
              <Grid item color='white'>
                SYMBOL
              </Grid>
              <Grid item color='white'>
                CATEGORY
              </Grid>
              <Grid item color='white'>
                BLOCKCHAIN
              </Grid>
              <Grid item color='white'>
                TGI
              </Grid>
              <Grid item color='white'>
                TYPE
              </Grid>
            </Grid>
            <Grid item sm={2} >
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.symbol}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.category}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {/* {getNetworkSymbol(chainId, true)} */}
                {poolInfo?.blockchain}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.tgi}
              </Grid>
              <Grid item color='#56C5FF' justifyContent='right' display='flex'>
                {poolInfo?.type}
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} marginTop='50px'>
            <Box color='#56C5FF'>{etherRaised}/{poolInfo?.hardCap} {getNetworkSymbol(chainId)}</Box>
            <Box position='relative' display='flex'>
              <Box width='100%' height='10px' borderRadius={2} backgroundColor='white' />
              <Box
                position='absolute'
                left='0px'
                borderRadius={2}
                height='10px'
                width={`${Number(etherRaised / poolInfo.hardCap * 100)}%`}
                backgroundColor='#56C5FF'
              />
            </Box>
          </Grid>
          <Grid item container marginTop='50px'>
            <Grid item sm={3} color='#56C5FF'>
              Your Contribution
            </Grid>
            <Grid item sm={3} color='#56C5FF'>
              Personal Min
            </Grid>
            <Grid item sm={3} color='#56C5FF'>
              Personal Max
            </Grid>
            <Grid item sm={3} color='#56C5FF'>
              Token Price
            </Grid>
            <Grid item sm={3} fontSize={28} color='white'>
              {myCollaboration} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item sm={3} fontSize={28} color='white'>
              {poolInfo?.minAllocationPerUser} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item sm={3} fontSize={28} color='white'>
              {maxAllocationHere} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item sm={3} fontSize={28} color='white'>
              {Number(1 / poolInfo?.presaleRate)} {getNetworkSymbol(chainId)}
            </Grid>
          </Grid>

          {!started &&
            <Grid item sm={12}>
              {/* <h5>Project is not started! {remainingHours} hour left. Your staked amount: {stakingamount}</h5> */}
            </Grid>
          }
          {!started && (stakingamount > 0) && account &&
            (
              approved ?
                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'no-drop' }}
                  color='white'
                  padding='10px 28px 10px 28px'
                >
                  Already Approved
                </Box> :
                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'pointer' }}
                  color='white'
                  padding='10px 28px 10px 28px'
                  onClick={() => preapprove()}
                >
                  PreApprove
                </Box>
            )
          }

          {/* started not ended */}
          {started && !ended && (buyCondition ? (
            <>
              <Grid item container marginTop='20px'>
                <Grid item sm={12} color='#56C5FF'>
                  Your BNB balance: {tokenBalance}
                </Grid>
                <Grid item container sm={6} bgcolor='#232323' position='relative' display='flex'>
                  <Box
                    component='input'
                    padding='5px'
                    width='100%'
                    height='50px'
                    placeholder='0.0'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: 5 }}
                    type="number"
                    value={buyingAmount}
                    onChange={(e) => setBuyingAmount(e.target.value)}
                  ></Box>
                  <Box
                    component='button'
                    position='absolute'
                    right='8px'
                    top='7px'
                    style={{ backgroundColor: '#56C5FF', height: '70%', border: 'none', borderRadius: 6 }}
                    color='white'
                    paddingLeft='20px'
                    paddingRight='20px'
                    onClick={() => setBuyingAmount(tokenBalance)}
                  >
                    MAX
                  </Box>
                </Grid>
              </Grid>
              <Grid marginTop='20px'>

                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6 }}
                  color='white'
                  padding='10px 28px 10px 28px'
                  onClick={() => buy()}
                >
                  BUY
                </Box>
              </Grid>
            </>
          ) : <></>)}

          {
            ended && <Box
              component='button'
              style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'pointer' }}
              color='white'
              padding='10px 28px 10px 28px'
              onClick={() => handleFinalize()}
            >
              Finalize
            </Box>
          }
        </Grid>
      </MHidden>

      {/* Mobile view */}
      <MHidden width='mdUp'>
        <Grid
          container
          border='1px solid #56C5FF'
          borderRadius={1}
          backgroundColor='#232323'
          padding='20px'
          rowSpacing={2}
        >
          <Grid item xs={12} color='#56C5FF' fontSize={20} justifyContent='center' display='flex'>
            Project Information
          </Grid>
          <Grid fontSize={16}>
            <Grid item xs={12} color='white' marginTop='20px'>
              HARDCAP
            </Grid>
            <Grid item xs={12} color='#56C5FF'>
              {poolInfo?.hardCap} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item xs={12} color='white' marginTop='15px'>
              OPEN TIME
            </Grid>
            <Grid item xs={12} color='#56C5FF'>
              {formattedDate(poolInfo?.startDateTime)}
            </Grid>
            <Grid item xs={12} color='white' marginTop='15px'>
              CLOSE TIME
            </Grid>
            <Grid item xs={12} color='#56C5FF'>
              {formattedDate(poolInfo?.endDateTime)}
            </Grid>
            <Grid item xs={12} color='white' marginTop='15px'>
              LISTING DATE
            </Grid>
            <Grid item xs={12} color='#56C5FF'>
              {formattedDate(poolInfo?.listDateTime)}
            </Grid>
            <Grid item xs={12} color='white' marginTop='15px'>
              DEAL
            </Grid>
            <Grid item xs={12} color='#56C5FF' marginBottom='30px'>
              {poolInfo?.deal}
            </Grid>
          </Grid>
          <Grid item xs={12} color='#56C5FF' fontSize={20} justifyContent='center' display='flex'>
            Token Information
          </Grid>
          <Grid item xs={12} color='#56C5FF' marginTop='15px' marginBottom='20px'>
            PRGC
          </Grid>
          <Grid item xs={6}>
            <Box color='white'>CATEGORY</Box>
            <Box color='#56C5FF' marginTop='2px'>
              {poolInfo?.category}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box color='white'>TGI</Box>
            <Box color='#56C5FF' marginTop='2px'>
              {poolInfo?.tgi}
            </Box>
          </Grid>
          <Grid item xs={6} marginTop='10px'>
            <Box color='white'>BLOCKCHAIN</Box>
            <Box color='#56C5FF' marginTop='2px'>
              {poolInfo?.blockchain}
            </Box>
          </Grid>
          <Grid item xs={6} marginTop='10px'>
            <Box color='white'>TYPE</Box>
            <Box color='#56C5FF' marginTop='2px'>
              {poolInfo?.type}
            </Box>
          </Grid>
          <Grid item xs={12} marginTop='30px' width='100%'>
            <Box color='#56C5FF'>{etherRaised}/{poolInfo?.hardCap} {getNetworkSymbol(chainId)}</Box>
            <Box position='relative' display='flex'>
              <Box width='100%' height='10px' borderRadius={2} backgroundColor='white' />
              <Box
                position='absolute'
                left='0px'
                borderRadius={2}
                height='10px'
                width={`${Number(etherRaised / poolInfo.hardCap * 100)}%`}
                backgroundColor='#56C5FF'
              />
            </Box>
          </Grid>
          <Grid item container marginTop='50px'>
            <Grid item xs={6} fontSize={16} color='#56C5FF'>
              Your Contribution
            </Grid>
            <Grid item xs={6} fontSize={22} color='white' display='flex' justifyContent='flex-end'>
              {myCollaboration} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item xs={6} fontSize={16} color='#56C5FF'>
              Personal Min
            </Grid>
            <Grid item xs={6} fontSize={22} color='white' display='flex' justifyContent='flex-end'>
              {poolInfo?.minAllocationPerUser} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item xs={6} fontSize={16} color='#56C5FF'>
              Personal Max
            </Grid>
            <Grid item xs={6} fontSize={22} color='white' display='flex' justifyContent='flex-end'>
              {maxAllocationHere} {getNetworkSymbol(chainId)}
            </Grid>
            <Grid item xs={6} fontSize={16} color='#56C5FF'>
              Token Price
            </Grid>
            <Grid item xs={6} fontSize={22} color='white' display='flex' justifyContent='flex-end'>
              {Number(1 / poolInfo?.presaleRate)} {getNetworkSymbol(chainId)}
            </Grid>
          </Grid>
          {!started &&
            <Grid item sm={12}>
              {/* <h5>Project is not started! {remainingHours} hour left.</h5> */}
            </Grid>
          }
          {!started && (stakingamount > 0) && account &&
            (
              approved ?
                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'no-drop' }}
                  color='white'
                  padding='10px 28px 10px 28px'
                >
                  Already Approved
                </Box> :
                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'pointer' }}
                  color='white'
                  padding='10px 28px 10px 28px'
                  onClick={() => preapprove()}
                >
                  PreApprove
                </Box>
            )
          }

          {started && !ended && (buyCondition ? (
            <>
              <Grid item container marginTop='20px'>
                <Grid item sm={12} color='#56C5FF'>
                  Your BNB balance: {tokenBalance}
                </Grid>
                <Grid item container sm={6} bgcolor='#232323' position='relative' display='flex'>
                  <Box
                    component='input'
                    padding='5px'
                    width='100%'
                    height='50px'
                    placeholder='0.0'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: 5 }}
                    type="number"
                    value={buyingAmount}
                    onChange={(e) => setBuyingAmount(e.target.value)}
                  ></Box>
                  <Box
                    component='button'
                    position='absolute'
                    right='8px'
                    top='7px'
                    style={{ backgroundColor: '#56C5FF', height: '70%', border: 'none', borderRadius: 6 }}
                    color='white'
                    paddingLeft='20px'
                    paddingRight='20px'
                    onClick={() => setBuyingAmount(tokenBalance)}
                  >
                    MAX
                  </Box>
                </Grid>
              </Grid>
              <Grid marginTop='20px'>
                <Box
                  component='button'
                  style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6 }}
                  color='white'
                  padding='10px 28px 10px 28px'
                  onClick={() => buy()}
                >
                  BUY
                </Box>
              </Grid>
            </>
          ) : <></>)}

          {
            ended && <Box
              component='button'
              style={{ backgroundColor: '#56C5FF', border: 'none', borderRadius: 6, marginRight: '10px', marginTop: '20px', cursor: 'pointer' }}
              color='white'
              padding='10px 28px 10px 28px'
              onClick={() => handleFinalize()}
            >
              Finalize
            </Box>
          }
        </Grid>
      </MHidden>
    </>
  );
}

function Detail({ data }) {
  const chainId = useSelector((store) => store.network.chainId);
  return (
    <>
      <MHidden width='mdDown'>
        <Grid style={{ backgroundColor: '#232323', borderRadius: 10, padding: '20px' }}>
          <Grid container direction='row'>
            <Grid item sm={8}>
              <Box component='img' src={isValidImage(data?.logo)} height={200}></Box>
            </Grid>
            <Grid item sm={4} display='flex' justifyContent='right' paddingRight='20px' sx={{ height: '40px' }}>
              <Box
                component='button'
                style={{
                  backgroundColor: 'rgba(242, 188, 26, 0.1)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#F9C013',
                  padding: '8px 10px'
                }}
              >
                <img src={getNetworkImage(chainId)} alt={data?.projectName} width={25} />
              </Box>
              <Box
                component='button'
                marginLeft='10px'
                style={{
                  background: '#000000',
                  border: 'none',
                  borderRadius: 8,
                  color: '#56C5FF',
                  padding: '5px 10px'
                }}
              >
                {data?.deal}
              </Box>
            </Grid>
          </Grid>
          <Grid marginTop='20px'>
            <Typography component='p' style={{ fontFamily: 'Segoe UI', fontSize: '48px', color: '#56C5FF' }}>
              {data?.projectName}
            </Typography>
            <Typography
              marginTop='15px'
              component='p'
              style={{ width: '55%', fontFamily: 'Segoe UI', fontSize: '20px' }}
            >
              {data?.description}
            </Typography>
          </Grid>
          <Grid marginTop='20px' align='center' justifyContent='center' alignItems='center'>
            <Typography
              component='p'
              style={{ width: '55%', fontFamily: 'Segoe UI', fontSize: '34px', color: '#56C5FF' }}
            >
            </Typography>
            <Box marginTop='30px' component='img' src={imageURL('projects-process.png')} />
          </Grid>
        </Grid>
      </MHidden>
      <MHidden width='mdUp'>
        <Grid style={{ backgroundColor: '#232323', borderRadius: 10, padding: '20px' }} position='relative'>
          <Box
            component='button'
            position='absolute'
            left='10px'
            top='10px'
            alignItems='center'
            style={{
              height: '40px',
              backgroundColor: 'rgba(242, 188, 26, 0.1)',
              border: 'none',
              borderRadius: 8,
              color: '#F9C013',
              padding: '7px 13px'
            }}
          >
            <img src={getNetworkImage(chainId)} alt={data?.projectName} width={25} />
          </Box>
          <Box
            component='button'
            position='absolute'
            right='10px'
            top='10px'
            alignItems='center'
            style={{
              height: '40px',
              background: '#000000',
              border: 'none',
              borderRadius: 8,
              color: '#56C5FF',
              padding: '7px 13px'
            }}
          >
            {data?.deal}
          </Box>
          <Grid item sm={12} justifyContent='center' display='flex'>
            <Box component='img' src={isValidImage(data?.logo)} />
          </Grid>
          <Grid item sm={12} justifyContent='center' display='flex'>
            <Typography
              component='p'
              marginTop='20px'
              style={{ fontFamily: 'Segoe UI', fontSize: '20px', color: '#56C5FF' }}
            >
              {data?.projectName}
            </Typography>
          </Grid>
          <Box
            marginTop='15px'
            component='p'
            textAlign='center'
            style={{ fontFamily: 'Segoe UI', fontSize: '12px', color: '#F1F0F0' }}
          >
            {data?.description}
          </Box>
          <Box
            component='button'
            style={{
              padding: '10px 5px',
              backgroundColor: '#56C5FF',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 10
            }}
          >
            CONNECT WALLET
          </Box>
          <Box
            component='button'
            marginLeft='10px'
            style={{
              padding: '10px',
              backgroundColor: '#232323',
              fontSize: 10,
              borderRadius: 4,
              border: '1px solid #56C5FF',
              color: '#56C5FF'
            }}
          >
            FOLLOW US
          </Box>
          <Box
            component='a'
            marginLeft='10px'
            href='#'
            style={{ fontFamily: 'Segoe UI', fontSize: '10px', color: '#56C5FF' }}
          >
            VIEW CONTRACT
          </Box>
        </Grid>
        {/*<Grid marginTop='20px' align='center' justifyContent='center' alignItems='center'>
          <Typography
            component='p'
            style={{ width: '55%', fontFamily: 'Segoe UI', fontSize: '22px', color: '#56C5FF' }}
          >
            Project Process
          </Typography>
        </Grid>*/}
        <Grid container marginTop='20px'>
          <Grid item xs={4} paddingLeft='10px'>
            <Box component='img' marginLeft='5px' src={imageURL('whitelist.png')}></Box>
            <Box fontSize={20}>Whitelist </Box>
            {/* <Box fontSize={12} marginTop="10px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi sit dictumst</Box> */}
          </Grid>
          <Grid item xs={4} paddingLeft='15px'>
            <Box component='img' src={imageURL('sale.png')} />
            <Box fontSize={20} marginLeft='10px'>
              Sale
            </Box>
            {/* <Box fontSize={12} marginTop="10px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi sit dictumst</Box> */}
          </Grid>
          <Grid item xs={4} paddingLeft='15px'>
            <Box component='img' src={imageURL('claim.png')} />
            <Box fontSize={20}>Claim</Box>
            {/* <Box fontSize={12} marginTop="10px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi sit dictumst</Box> */}
          </Grid>
        </Grid>
      </MHidden>
    </>
  );
}

function Roadmap({ roadmapData, title, id, description, description_url }) {
  // const chainId = useSelector((store) => store.network.chainId);
  // const { account } = useActiveWeb3React();
  // const [condition, setCondition] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     if (account && data !== undefined) {
  //       console.log('account', account);
  //       console.log('condition', data?.whiteLists.includes(account));
  //       setCondition(!data?.whitelistable || data?.whiteLists.includes(account));
  //     }
  //   })();
  // }, [account, data, roadmapdata]);

  return (
    <>
      <MHidden width='mdDown'>
        <Grid
          container
          border='1px solid #56C5FF'
          borderRadius={1}
          bgcolor='#232323'
          padding='60px'
          rowSpacing={3}
          margin={'100px 0px'}
          id={id}
        >
          <Grid item sm={12} color='#56C5FF' fontSize={48}>
            <Box component={'div'}>{title}</Box>
          </Grid>
          <Grid item sm={12} color='#fff' fontSize={18}>
            <Box component={'p'}>{description}</Box>
          </Grid>
          <Grid item sm={12} color='#56C5FF' fontSize={18}>
            <Box component={'div'}>
              <Box component={'img'} src={description_url} width={'100%'} />
            </Box>
          </Grid>
        </Grid>
      </MHidden>
      <MHidden width='mdUp'>
        <Grid
          container
          border='1px solid #56C5FF'
          borderRadius={1}
          bgcolor='#232323'
          padding='20px'
          rowSpacing={3}
          margin={'35px 0px'}
          id={id}
        >
          <Grid item md={12} sm={12} xsm={12} width={'100%'} color='#56C5FF' fontSize={24}>
            <Box component={'div'}>{title}</Box>
          </Grid>
          <Grid item md={12} sm={12} xsm={12} width={'100%'} color='#56C5FF' fontSize={16}>
            <Box component={'p'} color={'#fff'}>
              {description}
            </Box>
          </Grid>
          <Grid item md={12} sm={12} xsm={12} width={'100%'} color='#56C5FF'>
            <Box component={'div'}>
              <Box component={'img'} src={description_url} width={'100%'} />
            </Box>
          </Grid>
        </Grid>
      </MHidden>
    </>
  );
}
