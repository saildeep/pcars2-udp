/*************************************************************************************************

  Description: 
    Base definitions of udp packet structure
    The data definition mostly follows the data set for the Shared memory, so it is strongly suggested to have a look to the
    latest shared memory header if you have problem decoding any data.

*************************************************************************************************/
#ifndef _SMS_UDP_DEFINITIONS_HPP_
#define _SMS_UDP_DEFINITIONS_HPP_

#define SMS_UDP_PORT 5606
#define SMS_UDP_MAX_PACKETSIZE 1500

enum EUDPStreamerPacketHandlerType
{
	eCarPhysics = 0,
	eRaceDefinition = 1,
	eParticipants = 2,
	eTimings = 3,
	eGameState = 4,
	eWeatherState = 5, // not sent at the moment, information can be found in the game state packet
	eVehicleNames = 6, //not sent at the moment
	eTimeStats = 7,
	eParticipantVehicleNames = 8
};

/*
Each packet holds a base header with identification info to help with UDP unreliability.
*/

struct PacketBase
{
	unsigned int	mPacketNumber;						//0 counter reflecting all the packets that have been sent during the game run
	unsigned int	mCategoryPacketNumber;		//4 counter of the packet groups belonging to the given category
	unsigned char	mPartialPacketIndex;			//8 If the data from this class had to be sent in several packets, the index number
	unsigned char	mPartialPacketNumber;			//9 If the data from this class had to be sent in several packets, the total number
	unsigned char	mPacketType;							//10 what is the type of this packet (see EUDPStreamerPacketHanlderType for details)
	unsigned char	mPacketVersion;						//11 what is the version of protocol for this handler, to be bumped with data structure change
};																				//12 total size

/*******************************************************************************************************************
//
//	Telemetry data for the viewed participant. 
//
//	Frequency: Each tick of the UDP streamer how it is set in the options
//	When it is sent: in race
//
*******************************************************************************************************************/
#define UDP_STREAMER_CAR_PHYSICS_HANDLER_VERSION						2
#define TYRE_NAME_LENGTH_MAX											40

#pragma pack(push)
#pragma pack(1)
struct sTelemetryData
{
	static const unsigned int	sPacketSize = 538;
	PacketBase			sBase;														// 0 12
																										// Participant info
	signed char							sViewedParticipantIndex;					// 12 1
																										// Unfiltered input
	unsigned char							sUnfilteredThrottle;							// 13 1
	unsigned char							sUnfilteredBrake;									// 14 1
	signed char								sUnfilteredSteering;							// 15 1
	unsigned char							sUnfilteredClutch;								// 16 1
																										// Car state
	unsigned char							sCarFlags;												// 17 1
	signed short							sOilTempCelsius;									// 18 2
	unsigned short							sOilPressureKPa;									// 20 2
	signed short							sWaterTempCelsius;								// 22 2
	unsigned short							sWaterPressureKpa;								// 24 2
	unsigned short							sFuelPressureKpa;									// 26 2
	unsigned char							sFuelCapacity;										// 28 1
	unsigned char							sBrake;														// 29 1
	unsigned char							sThrottle;												// 30 1
	unsigned char							sClutch;													// 31 1
	float									sFuelLevel;												// 32 4
	float									sSpeed;														// 36 4
	unsigned short							sRpm;															// 40 2
	unsigned short							sMaxRpm;													// 42 2
	signed char								sSteering;												// 44 1
	unsigned char							sGearNumGears;										// 45 1
	unsigned char							sBoostAmount;											// 46 1
	unsigned char							sCrashState;											// 47 1
	float									sOdometerKM;											// 48 4
	float									sOrientation[3];									// 52 12
	float									sLocalVelocity[3];								// 64 12
	float									sWorldVelocity[3];								// 76 12
	float									sAngularVelocity[3];							// 88 12
	float									sLocalAcceleration[3];						// 100 12
	float									sWorldAcceleration[3];						// 112 12
	float									sExtentsCentre[3];								// 124 12
	unsigned char							sTyreFlags[4];										// 136 4
	unsigned char							sTerrain[4];											// 140 4
	float									sTyreY[4];												// 144 16
	float									sTyreRPS[4];											// 160 16
	unsigned char							sTyreTemp[4];											// 176 4
	float									sTyreHeightAboveGround[4];				// 180 16
	unsigned char							sTyreWear[4];											// 196 4
	unsigned char							sBrakeDamage[4];									// 200 4
	unsigned char							sSuspensionDamage[4];							// 204 4
	signed short							sBrakeTempCelsius[4];							// 208 8
	unsigned short							sTyreTreadTemp[4];								// 216 8
	unsigned short							sTyreLayerTemp[4];								// 224 8
	unsigned short							sTyreCarcassTemp[4];							// 232 8
	unsigned short							sTyreRimTemp[4];									// 240 8
	unsigned short							sTyreInternalAirTemp[4];					// 248 8
	unsigned short							sTyreTempLeft[4];									// 256 8
	unsigned short							sTyreTempCenter[4];								// 264 8
	unsigned short							sTyreTempRight[4];								// 272 8
	float									sWheelLocalPositionY[4];					// 280 16
	float									sRideHeight[4];										// 296 16
	float									sSuspensionTravel[4];							// 312 16
	float									sSuspensionVelocity[4];						// 328 16
	unsigned short							sSuspensionRideHeight[4];					// 344 8
	unsigned short							sAirPressure[4];									// 352 8
	float									sEngineSpeed;											// 360 4
	float									sEngineTorque;										// 364 4
	unsigned char							sWings[2];												// 368 2
	unsigned char							sHandBrake;												// 370 1
																										// Car damage
	unsigned char							sAeroDamage;											// 371 1
	unsigned char							sEngineDamage;										// 372 1
																										//  HW state
	unsigned int							sJoyPad0;													// 376 4
	unsigned char							sDPad;														// 377 1
	char									sTyreCompound[4][TYRE_NAME_LENGTH_MAX]; // 378 160
};																									// 538	
#pragma pack(pop)

#define PARTICIPANT_NAME_LENGTH_MAX										64
#define PARTICIPANTS_PER_PACKET											16
#define UDP_STREAMER_PARTICIPANTS_SUPPORTED 32

/*******************************************************************************************************************
//
//	Race stats data.  
//
//	Frequency: Logaritmic decrease
//	When it is sent: Counter resets on entering InRace state and again each time any of the values changes
//
*******************************************************************************************************************/
#define UDP_STREAMER_RACE_STATE_HANDLER_VERSION 1
#define TRACKNAME_LENGTH_MAX											64
struct sRaceData
{
	static const	unsigned int	sPacketSize = 308;
	PacketBase						sBase;												// 0 12
	float							sWorldFastestLapTime;								// 12
	float							sPersonalFastestLapTime;							// 16
	float							sPersonalFastestSector1Time;						// 20
	float							sPersonalFastestSector2Time;						// 24
	float							sPersonalFastestSector3Time;						// 28
	float							sWorldFastestSector1Time;							// 32
	float							sWorldFastestSector2Time;							// 36
	float							sWorldFastestSector3Time;							// 40
	float							sTrackLength;										// 44
	char							sTrackLocation[TRACKNAME_LENGTH_MAX];				// 48
	char							sTrackVariation[TRACKNAME_LENGTH_MAX];				// 112
	char							sTranslatedTrackLocation[TRACKNAME_LENGTH_MAX];		// 176
	char							sTranslatedTrackVariation[TRACKNAME_LENGTH_MAX];	// 240
	unsigned short		sLapsTimeInEvent;												// 304 contains lap number for lap based session or quantized session duration (number of 5mins) for timed sessions, the top bit is 1 for timed sessions
	signed char				sEnforcedPitStopLap;										// 306
};																						// 308

/*******************************************************************************************************************
//
//	Participant names data.  
//
//	Frequency: Logarithmic decrease
//	When it is sent: Counter resets on entering InRace state and again each  the participants change. 
//	The sParticipantsChangedTimestamp represent last time the participants has changed andis  to be used to sync 
//	this information with the rest of the participant related packets
//
*******************************************************************************************************************/
#define UDP_STREAMER_PARTICIPANTS_HANDLER_VERSION		1
struct sParticipantsData
{
	static const unsigned int	sPacketSize = 1040;
	PacketBase					sBase;				
	unsigned int				sParticipantsChangedTimestamp;
	char						sName[PARTICIPANTS_PER_PACKET][PARTICIPANT_NAME_LENGTH_MAX];
};

/*******************************************************************************************************************
//
//	Participant timings data.  
//
//	Frequency: Each tick of the UDP streamer how it is set in the options.
//	When it is sent: in race
//
*******************************************************************************************************************/
#define UDP_STREAMER_TIMINGS_HANDLER_VERSION						1
#pragma pack(push)
#pragma pack(1)
struct sParticipantInfo
{
	signed short							sWorldPosition[3];								// 0 -- 
	signed short							sOrientation[3];								// 6 -- Quantized heading (-PI .. +PI) , Quantized pitch (-PI / 2 .. +PI / 2),  Quantized bank (-PI .. +PI).
	unsigned short							sCurrentLapDistance;							// 12 --
	unsigned char							sRacePosition;									// 14 -- holds the race position, + top bit shows if the participant is active or not
	unsigned char							sSector;										// 15 -- sector + extra precision bits for x/z position
	unsigned char							sHighestFlag;									// 16 --
	unsigned char							sPitModeSchedule;								// 17 --
	unsigned short							sCarIndex;										// 18 -- top bit shows if participant is (local or remote) human player or not
	unsigned char							sRaceState;										// 20 -- race state flags + invalidated lap indication --
	unsigned char							sCurrentLap;									// 21 -- 
	float									sCurrentTime;									// 22 --
	float									sCurrentSectorTime;								// 26 --
};																							// 30

struct sTimingsData
{
	static const unsigned int						sPacketSize = 993;
	PacketBase						sBase;													// 0 12
	signed char						sNumParticipants;										// 12 --
	unsigned int					sParticipantsChangedTimestamp;							// 13 -- 
	float							sEventTimeRemaining;									// 17  // time remaining, -1 for invalid time,  -1 - laps remaining in lap based races  --
	float							sSplitTimeAhead;										// 21 --
	float							sSplitTimeBehind;										// 25 -- 
	float							sSplitTime;												// 29 --
	sParticipantInfo				sPartcipants[UDP_STREAMER_PARTICIPANTS_SUPPORTED];		// 33 960
};																							// 993
#pragma pack(pop)	

/*******************************************************************************************************************
//
//	Game State. 
//
//	Frequency: Each 5s while being in Main Menu, Each 10s while being in race + on each change Main Menu<->Race several times.
//	the frequency in Race is increased in case of weather timer being faster  up to each 5s for 30x time progression
//	When it is sent: Always
//
*******************************************************************************************************************/
#define UDP_STREAMER_GAME_STATE_HANDLER_VERSION 2
struct sGameStateData
{
	static const unsigned int								sPacketSize = 24;
	PacketBase												sBase;						//10
	unsigned short											mBuildVersionNumber; 		//12
	char													mGameState;					//15 -- first 3 bits are used for game state enum, second 3 bits for session state enum See shared memory example file for the enums
	signed char												sAmbientTemperature;		//16
	signed char												sTrackTemperature;			//17
	unsigned char											sRainDensity;				//18
	unsigned char											sSnowDensity;				//19
	signed char												sWindSpeed;					//20
	signed char												sWindDirectionX;			//21
	signed char												sWindDirectionY;			//22 padded to 24
};	


/*******************************************************************************************************************
//
//	Participant Stats and records
//
//	Frequency: When entering the race and each time any of the values change, so basically each time any of the participants
//						crosses a sector boundary.
//	When it is sent: In Race
//
*******************************************************************************************************************/
#define UDP_STREAMER_TIME_STATS_HANDLER_VERSION						1 
struct sParticipantStatsInfo
{
	float							sFastestLapTime;								// 0
	float							sLastLapTime;									// 4
	float							sLastSectorTime;								// 8
	float							sFastestSector1Time;							// 11
	float							sFastestSector2Time;							// 16
	float							sFastestSector3Time;							// 20
};																					// 24

struct sParticipantsStats
{
	sParticipantStatsInfo	sParticipants[UDP_STREAMER_PARTICIPANTS_SUPPORTED]; //768
};

struct sTimeStatsData
{
	static const unsigned int		sPacketSize = 784;
	PacketBase						sBase;											// 0 12
	unsigned int					sParticipantsChangedTimestamp;					// 12
	sParticipantsStats				sStats;											// 16 + 768
};																					// 784

/*******************************************************************************************************************
//
//	Participant Vehicle names
//
//	Frequency: Logarithmic decrease
//	When it is sent: Counter resets on entering InRace state and again each  the participants change. 
//	The sParticipantsChangedTimestamp represent last time the participants has changed and is  to be used to sync 
//	this information with the rest of the participant related packets
//
//	Note: This data is always sent with at least 2 packets. The 1-(n-1) holds the vehicle name for each participant
//	The last one holding the class names.
//
*******************************************************************************************************************/
#define UDP_STREAMER_PARTICIPANT_VEHICLE_NAMES_HANDLER_VERSION	2
#define VEHICLE_NAME_LENGTH_MAX											64
#define CLASS_NAME_LENGTH_MAX											20
#define VEHICLES_PER_PACKET												16
#define CLASSES_SUPPORTED_PER_PACKET									60

struct sVehicleInfo
{
	unsigned short				sIndex; // 0 2
	unsigned int				sClass; // 2 6 
	char						sName[VEHICLE_NAME_LENGTH_MAX]; // 6 70
}; // padded to 72

		
struct sParticipantVehicleNamesData
{
	static const unsigned int	sPacketSize = 1164;
	PacketBase					sBase; // 0 12
	sVehicleInfo				sVehicles[VEHICLES_PER_PACKET]; //12 16*72
};	// 1164

struct sClassInfo
{
	unsigned int				sClassIndex; // 0 4 
	char						sName[CLASS_NAME_LENGTH_MAX]; // 4 24
};

struct sVehicleClassNamesData
{
	static const unsigned int	sPacketSize = 1452;
	PacketBase					sBase; // 0 12
	sClassInfo					sClasses[CLASSES_SUPPORTED_PER_PACKET]; //12 24*60
};				 			// 1452
										
#endif //_SMS_UDP_DEFINITIONS_HPP_
