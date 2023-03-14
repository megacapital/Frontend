import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useSelector } from 'redux/store';
import { getNetworkImage, getNetworkSymbol } from '../utils/networkSymbol';
import { useNavigate } from 'react-router-dom';
import { formattedDate, imageURL, isValidImage } from '../utils';
// import { atcb_init } from 'add-to-calendar-button';
import 'add-to-calendar-button/assets/css/atcb.css';
import { atcb_action } from 'add-to-calendar-button';

export default function LaunchCard(props) {
  const navigate = useNavigate();
  const { name = '', weiRaised, address = '', tag = '', privacy = '', ipfs, startDateTime = 'TBA', endDateTime, sm= 4 } = props;

  const { chainId = 0 } = useSelector((store) => store.network);
  console.log(chainId);
  const handleGoogleCalander = (e) => {
    e.stopPropagation();
    atcb_action({
      name: name,
      description: 'A nice description does not hurt',
      startDate: startDateTime,
      endDate: endDateTime,
      options: ['Google'],
      timeZone: 'Europe/Berlin'
    });
  };

  // console.log(props, 'LAUNCH CARD');

  return (
    <Grid item sm={sm}>
      <Card>
        {/* onClick={() => navigate(`/project/${address}`)} */}
        <CardActionArea onClick={() => navigate(`/project/${address}`)}>
          <CardContent style={{ backgroundColor: '#232323', padding: '10px' }}>
            <Grid>
              <Grid marginBottom="10px" display="flex">
                <Box component="img" src={isValidImage(ipfs?.logo)} width="100%" height={250}></Box>
                <Box
                  bgcolor={'#232323'}
                  borderRadius={1}
                  padding="5px 20px 5px 20px"
                  position="absolute"
                  left="20px"
                  top="15px"
                >
                  {privacy}
                </Box>
                <Box
                  bgcolor={'#232323'}
                  borderRadius={1}
                  padding="5px 20px 5px 20px"
                  position="absolute"
                  right="20px"
                  top="15px"
                >
                  {tag}{' '}
                </Box>
              </Grid>
              <Grid>
                <Grid display="flex" position="relative">
                  <Box component="h4" color="#00BFFF" position="relative" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {name} <span><img src={getNetworkImage(chainId)} width={25} alt={name} /></span>
                  </Box>
                  <Box component="img" src={ipfs?.logo} position="absolute" right="0px" width={'40px'}></Box>
                </Grid>
              </Grid>
              <Grid marginTop="10px">
                <Grid dispay="flex" position="relative" container direction="row">
                  <Box item component="p" position="relative">
                    Total Raise
                  </Box>
                  <Box item component="p" position="absolute" right="0px" fontSize="24px">
                    {getNetworkSymbol(chainId)} {weiRaised}
                  </Box>
                </Grid>
              </Grid>
              <Grid width="100%" bgcolor="#000000" padding="6px" style={{ borderRadius: 6 }} marginTop="10px">
                <Box component="h5" display="flex" align="center" justifyContent="center" color="#00BFFF">
                  {formattedDate(startDateTime)}
                </Box>
              </Grid>
              <Grid marginTop="10px" display="flex" align="center" justifyContent="center">
                <Box component="div" color="white" onClick={handleGoogleCalander}>
                  Add to Google Calendar
                </Box>
              </Grid>
              <Grid marginTop="5px" display="flex" align="center" justifyContent="center">
                <Box component="a" href="/project">
                  <i class="fa-solid fa-circle-arrow-right text-info"></i>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
