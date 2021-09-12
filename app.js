//require
var express = require('express'); //express framework
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');
var axios = require('axios');

//use
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//DATABASE
// production DB
mongoose.connect(
	'mongodb+srv://Ben:' +
		encodeURIComponent('8+ff!Es$)GPivW@27!4sN3!q2!GIEZ') +
		'@holiday.dbnfz.mongodb.net/Holiday?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

var connection = mongoose.connection;
connection.once('open', function () {
	//console.log("Database is now connected")
});

// Collections

// january
var januarySchema = new mongoose.Schema({ holiday_name: String, date: String });
var January_holidays = mongoose.model('January_holidays', januarySchema);

// february
var februarySchema = new mongoose.Schema({ holiday_name: String, date: String });
var February_holidays = mongoose.model('February_holidays', februarySchema);

// march
var marchSchema = new mongoose.Schema({ holiday_name: String, date: String });
var March_holidays = mongoose.model('March_holidays', marchSchema);

// april
var aprilSchema = new mongoose.Schema({ holiday_name: String, date: String });
var April_holidays = mongoose.model('April_holidays', aprilSchema);

// may
var maySchema = new mongoose.Schema({ holiday_name: String, date: String });
var May_holidays = mongoose.model('May_holidays', maySchema);

// june
var juneSchema = new mongoose.Schema({ holiday_name: String, date: String });
var June_holidays = mongoose.model('June_holidays', juneSchema);

// july
var julySchema = new mongoose.Schema({ holiday_name: String, date: String });
var July_holidays = mongoose.model('July_holidays', julySchema);

// august
var augustSchema = new mongoose.Schema({ holiday_name: String, date: String });
var August_holidays = mongoose.model('August_holidays', augustSchema);

// september
var septemberSchema = new mongoose.Schema({ holiday_name: String, date: String });
var September_holidays = mongoose.model('September_holidays', septemberSchema);

// october
var octoberSchema = new mongoose.Schema({ holiday_name: String, date: String });
var October_holidays = mongoose.model('October_holidays', octoberSchema);

// november
var novemberSchema = new mongoose.Schema({ holiday_name: String, date: String });
var November_holidays = mongoose.model('November_holidays', novemberSchema);

// december
var decemberSchema = new mongoose.Schema({ holiday_name: String, date: String });
var December_holidays = mongoose.model('December_holidays', decemberSchema);

// is_holidays_inserted
var isHolidaysInsertedSchema = new mongoose.Schema({ is_holidays_inserted: Boolean });
var Is_holidays_inserted = mongoose.model('Is_holidays_inserted', isHolidaysInsertedSchema);

// calendar_year
var calendarYearSchema = new mongoose.Schema({ calendar_year: String });
var Calendar_year = mongoose.model('Calendar_year', calendarYearSchema);

//================================
//ROUTES

//root
app.get('/', function (req, res) {
	var holidays = undefined;

	// Get date
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	
	var months_guide = [
							'January',
							'February',
							'March',
							'April',
							'May',
							'June',
							'July',
							'August',
							'September',
							'October',
							'November',
							'December',
	];


	// ==========================================================
	// if calendar year is empty, insert year - 1 to the database
	// ==========================================================
	Calendar_year.find({}, function (error, inserted_calendar_year) {
		if (inserted_calendar_year.length === 0) {
			var calendar_year_value = new Calendar_year({ calendar_year: year - 1 });
			calendar_year_value.save();
		}

		// =================================================================
		// if Is_holidays_inserted is empty, insert all holidays to database
		// =================================================================
		Is_holidays_inserted.find({}, function (error, inserted_holiday_data) {
			if (inserted_holiday_data.length === 0) {
				axios
					.get(
						'https://holidayapi.com/v1/holidays?pretty&key=e9bcdc8b-7d0f-41ba-9197-c0ffd7c2c04b&country=PH&year=' +
							(new Date().getFullYear() - 1)
					)
					.then(function (response) {
						holidays = response.data.holidays;


						// save all holidays to database
						for (var i = 0; i < holidays.length; i++) {
							var month = months_guide[Number(holidays[i]['date'].slice(5, 7)) - 1];

							if (month === 'January')
								var holiday = new January_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'February')
								var holiday = new February_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'March')
								var holiday = new March_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'April')
								var holiday = new April_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'May')
								var holiday = new May_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'June')
								var holiday = new June_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'July')
								var holiday = new July_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'August')
								var holiday = new August_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'September')
								var holiday = new September_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'October')
								var holiday = new October_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else if (month === 'November')
								var holiday = new November_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});
							else
								var holiday = new December_holidays({
									holiday_name: holidays[i]['name'],
									date: holidays[i]['date'],
								});

							holiday.save();
						}
						// end of inserting all holidays throughout the year

						// update is_holidays_inserted
						var is_inserted_holidays_value = new Is_holidays_inserted({
							is_holidays_inserted: true,
						});
						is_inserted_holidays_value.save();
					});
				// end, .then()
			}
			// end of if block

			// ============================================
			// if new year, drop old holidays and then update to a new holidays
			// ============================================
			Calendar_year.find({}, function (error, inserted_calendar_year) {
				for (var inserted_calendar_year_data of inserted_calendar_year) {
					if (inserted_calendar_year_data['calendar_year'] !== year - 1) {
						// Drop the current database
						mongoose.connection.db.dropDatabase(function (error) {
							if (error) console.log(error);

							axios
								.get(
									'https://holidayapi.com/v1/holidays?pretty&key=e9bcdc8b-7d0f-41ba-9197-c0ffd7c2c04b&country=PH&year=' +
										(new Date().getFullYear() - 1)
								)
								.then(function (response) {
									holidays = response.data.holidays;

									var months_guide = [
										'January',
										'February',
										'March',
										'April',
										'May',
										'June',
										'July',
										'August',
										'September',
										'October',
										'November',
										'December',
									];

									// save all holidays to database
									for (var i = 0; i < holidays.length; i++) {
										var month =
											months_guide[
												Number(holidays[i]['date'].slice(5, 7)) - 1
											];

										if (month === 'January')
											var holiday = new January_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'February')
											var holiday = new February_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'March')
											var holiday = new March_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'April')
											var holiday = new April_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'May')
											var holiday = new May_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'June')
											var holiday = new June_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'July')
											var holiday = new July_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'August')
											var holiday = new August_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'September')
											var holiday = new September_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'October')
											var holiday = new October_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else if (month === 'November')
											var holiday = new November_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});
										else
											var holiday = new December_holidays({
												holiday_name: holidays[i]['name'],
												date: holidays[i]['date'],
											});

										holiday.save();
									}
									// end of inserting all holidays throughout the year

									// update is_holidays_inserted
									var is_inserted_holidays_value = new Is_holidays_inserted({
										is_holidays_inserted: true,
									});
									is_inserted_holidays_value.save();

									// update the calendar year
									var calendar_year_value = new Calendar_year({
										calendar_year: year - 1,
									});
									calendar_year_value.save();
								});
							// end, .then()
						});
						// end, drop db
					}
				}
				
				// ===========================
				// check if today is a holiday
				// ===========================
				// Get date
			var dateObj = new Date();
			var month = dateObj.getUTCMonth() + 1; //months from 1-12
			var day = dateObj.getUTCDate();
			var year = dateObj.getUTCFullYear();

			// Date today
			var date_today = year - 1 + '-' + month + '-' + day;

			var is_today_holiday = undefined;

			// check if today is holiday
			if (months_guide[month - 1] === 'January') {
				January_holidays.find({}, function (error, jan_holidays) {
					for (var jan_holiday of jan_holidays) {
						if (jan_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'February') {
				February_holidays.find({}, function (error, feb_holidays) {
					for (var feb_holiday of feb_holidays) {
						if (feb_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'March') {
				March_holidays.find({}, function (error, mar_holidays) {
					for (var mar_holiday of mar_holidays) {
						if (mar_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'April') {
				April_holidays.find({}, function (error, apr_holidays) {
					for (var apr_holiday of apr_holidays) {
						if (apr_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'May') {
				May_holidays.find({}, function (error, ma_holidays) {
					for (var ma_holiday of ma_holidays) {
						if (ma_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'June') {
				June_holidays.find({}, function (error, jun_holidays) {
					for (var jun_holiday of jun_holidays) {
						if (jun_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'July') {
				July_holidays.find({}, function (error, jul_holidays) {
					for (var jul_holiday of jul_holidays) {
						if (jul_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'August') {
				August_holidays.find({}, function (error, aug_holidays) {
					for (var aug_holiday of aug_holidays) {
						if (aug_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'September') {
				September_holidays.find({}, function (error, sept_holidays) {
					for (var sept_holiday of sept_holidays) {
						if (sept_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'October') {
				October_holidays.find({}, function (error, oct_holidays) {
					for (var oct_holiday of oct_holidays) {
						if (oct_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'November') {
				November_holidays.find({}, function (error, nov_holidays) {
					for (var nov_holiday of nov_holidays) {
						if (nov_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			if (months_guide[month - 1] === 'December') {
				December_holidays.find({}, function (error, decem_holidays) {
					for (var decem_holiday of decem_holidays) {
						if (decem_holiday['date'] === date_today) {
							is_today_holiday = true;
							break
						}
					}
					
					return res.render('landing', { is_today_holiday: is_today_holiday });
				});
			}
			// end, checking if today is a holiday then return res.render landing 
			
		
			});
			// end, if new year, update all holidays accordingly
		});
		// end, if Is_holidays_inserted is empty, insert all holidays to database
	});
	// end, if calendar year is empty, insert year - 1 to the database
});


// calendar
app.get("/calendar", function (req, res){
	 var holidays = []
	
	 January_holidays.find({}, function (error, jan_holidays){
		 February_holidays.find({}, function (error, feb_holidays){
			 March_holidays.find({}, function (error, mar_holidays){
				 April_holidays.find({}, function (error, apr_holidays){
					 May_holidays.find({}, function (error, ma_holidays){
						 June_holidays.find({}, function (error, jun_holidays){
							 July_holidays.find({}, function (error, jul_holidays){
								 August_holidays.find({}, function (error, aug_holidays){
									 September_holidays.find({}, function (error, sept_holidays){
										 October_holidays.find({}, function (error, oct_holidays){
											 November_holidays.find({}, function (error, nov_holidays){
												 December_holidays.find({}, function (error, decem_holidays){
													 res.render("calendar", {"jan_holidays": jan_holidays, "feb_holidays": feb_holidays, "mar_holidays": mar_holidays, "apr_holidays": apr_holidays, "ma_holidays": ma_holidays, "jun_holidays": jun_holidays, "jul_holidays": jul_holidays, "aug_holidays": aug_holidays, "sept_holidays": sept_holidays, "oct_holidays": oct_holidays, "nov_holidays": nov_holidays, "decem_holidays": decem_holidays})                                                         
												 })
											 })
										 })
									 })
								 })
							 })
						 })
					 })
				 })
			 })
		 })
	 })
	 
})



//app.listen
app.listen(process.env.PORT || 3000, function () {
	console.log('Server is running.');
	console.log('.');
	console.log('.');
	console.log('.');
});




