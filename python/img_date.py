from PIL import Image, ExifTags
from datetime import datetime


def get_photo_datetime(file_path: str) -> tuple[bool, datetime | None]:
    """
    Получает дату/время съёмки из EXIF-метаданных изображения.

    Args:
        file_path: Полный путь к файлу изображения

    Returns:
        (True, datetime) - если дата съёмки найдена
        (False, None) - если метаданные отсутствуют или произошла ошибка
    """
    try:
        with Image.open(file_path) as img:
            exif = img.getexif()
            if not exif:
                return False, None

            # Получаем EXIF IFD, где хранится DateTimeOriginal
            exif_ifd = exif.get_ifd(ExifTags.IFD.Exif)

            # DateTimeOriginal (тег 36867) - дата съёмки
            date_str = exif_ifd.get(36867)
            # # DateTimeDigitized (тег 36868) - дата оцифровки (запасной вариант)
            # date_str = exif_ifd.get(36867) or exif_ifd.get(36868)

            # if not date_str:
            #     # Проверяем основной DateTime в корне EXIF (тег 306)
            #     date_str = exif.get(306)

            if not date_str:
                return False, None

            # Формат EXIF: "YYYY:MM:DD HH:MM:SS"
            dt = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
            return True, dt

    except Exception:
        return False, None
